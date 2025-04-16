import clinic from "../../db/models/clinic.js";
import user from "../../db/models/User.js";
import { summarizeChat } from "../../utils/summarize_chat.js";
import { getChannelIndicator } from "../../utils/channel.js";
import { extractTurkishPhoneNumber } from "../../utils/phone.js";
import {
  addLeadingNameToMessage,
  removeEmojisAndExclamations,
} from "../../utils/message.js";
import OpenAI from "openai";

let clients = [];
let pendingResponses = new Map();

function sendToClients(data) {
  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

async function sendAggregatedResponse(indicator, assistantId) {
  if (pendingResponses.has(indicator)) {
    const { messages, threadId } = pendingResponses.get(indicator);
    const finalMessage = messages.join(" ");
    try {
      const answer = await reply({
        input: finalMessage,
        threadId,
        assistantId,
      });

      pendingResponses.delete(indicator);

      return answer;
    } catch (error) {
      console.error("OpenAI Error:", error);
      return { success: false, error: "Internal Server Error" };
    }
  }
  return { success: false, error: "No pending response found" };
}

// eslint-disable-next-line no-undef
const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const createThread = async () => await openaiClient.beta.threads.create();

const createMessage = async ({
  thread_id,
  messageContent = "Default message content",
  role = "user",
}) => {
  if (!thread_id) throw new Error("Thread id is required");
  return await openaiClient.beta.threads.messages.create(thread_id, {
    role,
    content: messageContent,
  });
};

const runAssistant = async ({ threadId, assistantId }) => {
  if (!assistantId) throw new Error("Assistant id is required");
  return await openaiClient.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: assistantId,
  });
};

async function reply({ input, threadId, assistantId }) {
  if (!input)
    return { messages: ["Bana bir girdi sağlayınız.."], status: "failed" };

  let thread_id = threadId || (await createThread()).id;
  await createMessage({ thread_id, messageContent: input });

  const run = await runAssistant({ threadId: thread_id, assistantId });

  while (run.status !== "completed") {
    if (run.status === "failed")
      return { messages: null, status: run.status, error: run.last_error };
    await new Promise((r) => setTimeout(r, 1000));
  }

  const messages = await openaiClient.beta.threads.messages.list(run.thread_id);
  return { messages, status: run.status, thread_id };
}

export default async function sendMessage(body, clinic_id) {
  if (!body.input) {
    return { status: 400, data: { error: "Input is required" } };
  }

  const indicator = getChannelIndicator(body.channel) ?? null;

  const related_clinic = await clinic.findById(clinic_id);
  if (!related_clinic) {
    return { status: 404, data: { error: "Clinic not found" } };
  }

  const clinic_assistant_id = related_clinic?.openai_assistant?.assistant_id;
  if (!clinic_assistant_id) {
    return { status: 404, data: { error: "Assistant not found" } };
  }

  if (!indicator) {
    return { status: 400, data: { error: "Invalid channel" } };
  }

  const contact_channel = body.channel;
  const { input } = body;

  const customer = await user.findOne({
    [`channels.${body.channel}.profile_info.${indicator}`]:
      body.contact_data?.[indicator],
    clinic_id: clinic_id,
  });

  const phoneNumber = extractTurkishPhoneNumber(input);
  const channelData = customer?.channels?.[contact_channel];
  const messages = channelData?.messages || [];

  if (phoneNumber && messages.length > 0) {
    try {
      const formatted = messages.map((msg) => ({
        sender: msg.role === "agent" ? "assistant" : "user",
        text: msg.content,
      }));

      const summary = await summarizeChat(formatted);

      const newNotification = {
        type: "ai-summary",
        date: new Date(),
        clinic_id: clinic_id,
        body: {
          summary,
          phone: phoneNumber,
          userId: customer._id,
          clinic_id: clinic_id,
          channel: "instagram",
        },
      };

      await clinic.findOneAndUpdate(
        { clinic_id: clinic_id },
        { $push: { notifications: newNotification } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      sendToClients({
        type: "summary",
        clinicId: clinic_id,
        userId: customer._id,
        phoneNumber,
      });
    } catch (err) {
      console.error("Özetleme sırasında hata:", err.message);
    }
  }

  const modifiedInput = customer?.channels[contact_channel]?.thread_id
    ? input
    : addLeadingNameToMessage(input, customer?.full_name ?? body.full_name);

  const handleOpenAIResponse = async () => {
    const answer = await sendAggregatedResponse(indicator, clinic_assistant_id);
    if (answer?.error) {
      console.error("OpenAI Error:", answer.error);
      return { status: 400, data: { error: answer.error } };
    }

    const agent_reply =
      answer.messages?.body?.data?.[0]?.content[0]?.text?.value;

    const agent_message = {
      content: removeEmojisAndExclamations(agent_reply),
      type: "text",
      timestamp: new Date(),
      fresh: true,
      role: "agent",
    };

    const user_message = {
      content: modifiedInput,
      type: "text",
      timestamp: new Date(),
      fresh: true,
      role: "user",
    };

    const userPhone = extractTurkishPhoneNumber(modifiedInput);

    if (!customer) {
      await user.create({
        full_name:
          body.contact_data.full_name ??
          `${body.contact_data.first_name} ${body.contact_data.last_name}`,
        email: body.email,
        phone: body.phone ?? userPhone ?? null,
        clinic_id: body.clinic_id,
        profile_pic: body.contact_data.profile_pic,
        initial_channel: contact_channel,
        channels: {
          [contact_channel]: {
            profile_info: {
              [indicator]: body.contact_data?.[indicator],
              name: body.contact_data.full_name,
              profile_pic: body.contact_data.profile_pic,
              phone: body.phone ?? userPhone ?? null,
            },
            phone_giving_date: userPhone ? new Date() : null,
            first_message_date: new Date(),
            last_message_date: new Date(),
            thread_id: answer.thread_id,
            messages: [user_message, agent_message],
            last_updated: new Date(),
          },
        },
      });
    } else {
      await user.updateOne(
        { _id: customer._id },
        {
          $set: {
            [`channels.${contact_channel}.thread_id`]: answer.thread_id,
            [`channels.${contact_channel}.last_updated`]: new Date(),
            [`channels.${contact_channel}.last_message_date`]: new Date(),
            ...(userPhone && {
              phone: userPhone,
              [`channels.${contact_channel}.profile_info.phone`]: userPhone,
              [`channels.${contact_channel}.phone_giving_date`]: new Date(),
            }),
          },
          $push: {
            [`channels.${contact_channel}.messages`]: {
              $each: [user_message, agent_message],
            },
          },
        }
      );
    }

    return { status: 200, data: { message: "Message created successfully" } };
  };

  if (pendingResponses.has(indicator)) {
    const pending = pendingResponses.get(indicator);
    pending.messages.push(modifiedInput);
    clearTimeout(pending.timeout);
    pending.timeout = setTimeout(handleOpenAIResponse, 5500);
  } else {
    const messages = [modifiedInput];
    const timeout = setTimeout(handleOpenAIResponse, 5500);
    pendingResponses.set(indicator, {
      messages,
      timeout,
      threadId: customer?.channels[contact_channel]?.thread_id,
    });
  }

  return {
    status: 200,
    data: { message: "Message received and will be handled shortly" },
  };
}
