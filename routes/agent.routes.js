import express from "express";
import OpenAI from "openai";
import clinic from "../db/models/Clinic.js";
import user from "../db/models/User.js";
import dotenv from "dotenv";
import { summarizeChat } from "../utils/summarize_chat.js";
import { getChannelIndicator } from "../utils/channel.js";
import { extractTurkishPhoneNumber } from "../utils/phone.js";
import {
  addLeadingNameToMessage,
  removeEmojisAndExclamations,
} from "../utils/message.js";

let clients = [];
function sendToClients(data) {
  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

dotenv.config();
const pendingResponses = new Map(); // Store messages before sending
const router = express.Router();
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

      return answer; // Return answer to be handled by the caller function
    } catch (error) {
      console.error("OpenAI Error:", error);
      return { success: false, error: "Internal Server Error" }; // Return an error object
    }
  }
  return { success: false, error: "No pending response found" }; // Return a default error response
}

router.post("/send_message", async (req, res) => {
  if (!req.body.input)
    return res.status(400).json({ error: "Input is required" });

  const indicator = getChannelIndicator(req.body.channel) ?? null;
  try {
    const related_clinic = await clinic.findOne({
      clinic_id: req.body.clinic_id,
    });
    if (!related_clinic)
      return res.status(404).json({ error: "Clinic not found" });

    const clinic_assistant_id = related_clinic?.openai_assistant?.assistant_id;
    if (!clinic_assistant_id)
      return res.status(404).json({ error: "Assistant not found" });

    if (!indicator) return res.status(400).json({ error: "Invalid channel" });

    const contact_channel = req.body.channel;
    const { input } = req.body;

    const customer = await user.findOne({
      [`channels.${req.body.channel}.profile_info.${indicator}`]:
        req.body.contact_data?.[indicator],
      clinic_id: req.body.clinic_id,
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
          title: "AI Özeti Üretildi",
          type: "ai-summary",
          date: new Date(),
          body: {
            summary,
            phone: phoneNumber,
            userId: customer._id,
            clinic_id: req.body.clinic_id,
            channel: "instagram",
          },
        };
        // TODO: Remove later
        const mock_clinic_id = "yasinakgul_bakirkoy";
        await clinic.findOneAndUpdate(
          { clinic_id: mock_clinic_id },
          {
            $push: { notifications: newNotification }, // Push new notification
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        sendToClients({
          type: "summary",
          clinicId: req.body.clinic_id,
          userId: customer._id,
          phoneNumber,
        });
      } catch (err) {
        console.error("Özetleme sırasında hata:", err.message);
      }
    }

    const modifiedInput = customer?.channels[contact_channel]?.thread_id
      ? input
      : addLeadingNameToMessage(
          input,
          customer?.full_name ?? req.body.full_name
        );

    if (pendingResponses.has(indicator)) {
      const pending = pendingResponses.get(indicator);
      pending.messages.push(modifiedInput);
      clearTimeout(pending.timeout);

      pending.timeout = setTimeout(async () => {
        const answer = await sendAggregatedResponse(
          indicator,
          clinic_assistant_id
        );
        if (answer?.error) {
          console.error("Error from OpenAI:", answer.error);
          return res.status(400).json({ error: answer.error });
        }

        // Process answer inline (No helper function used)
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
              req.body.contact_data.full_name ??
              `${req.body.contact_data.first_name} ${req.body.contact_data.last_name}`,
            email: req.body.email,
            phone: req.body.phone ?? userPhone ?? null,
            clinic_id: req.body.clinic_id,
            profile_pic: req.body.contact_data.profile_pic,
            initial_channel: contact_channel,
            channels: {
              [contact_channel]: {
                profile_info: {
                  [indicator]: req.body.contact_data?.[indicator],
                  name: req.body.contact_data.full_name,
                  profile_pic: req.body.contact_data.profile_pic,
                  phone: req.body.phone ?? userPhone ?? null,
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
                  [`channels.${contact_channel}.profile_info.phone`]:
                    userPhone ?? null,
                  [`channels.${contact_channel}.phone_giving_date`]: userPhone
                    ? new Date()
                    : null,
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

        res.status(200).json({ message: "Message created successfully" });
      }, 5500);
    } else {
      const messages = [modifiedInput];
      const timeout = setTimeout(async () => {
        const answer = await sendAggregatedResponse(
          indicator,
          clinic_assistant_id
        );
        if (answer?.error) {
          console.error("Error from OpenAI:", answer.error);
          return res.status(400).json({ error: answer.error });
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
              req.body.contact_data.full_name ??
              `${req.body.contact_data.first_name} ${req.body.contact_data.last_name}`,
            email: req.body.email,
            phone: req.body.phone ?? userPhone ?? null,
            clinic_id: req.body.clinic_id,
            profile_pic: req.body.contact_data.profile_pic,
            initial_channel: contact_channel,
            channels: {
              [contact_channel]: {
                profile_info: {
                  [indicator]: req.body.contact_data?.[indicator],
                  name: req.body.contact_data.full_name,
                  profile_pic: req.body.contact_data.profile_pic,
                  phone: req.body.phone ?? userPhone ?? null,
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
                  [`channels.${contact_channel}.profile_info.phone`]:
                    userPhone ?? null,
                  [`channels.${contact_channel}.phone_giving_date`]: userPhone
                    ? new Date()
                    : null,
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

        res.status(200).json({ message: "Message created successfully" });
      }, 5500);
      pendingResponses.set(indicator, {
        messages,
        timeout,
        threadId: customer?.channels[contact_channel]?.thread_id,
      });
    }
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/get_fresh_messages", async (req, res) => {
  const indicator = getChannelIndicator(req.body.channel) ?? null;
  try {
    if (!req.body.clinic_id)
      return res.status(400).json({ error: "clinic_id is required" });

    if (!req.body.channel)
      return res.status(400).json({ error: "channel is required" });

    if (!indicator) return res.status(400).json({ error: "Invalid channel" });
    if (!req.body.contact_data?.[indicator])
      return res.status(400).json({ error: `${indicator} is required` });
  } catch (err) {
    const error = err.message ?? err;
    return res.status(400).json({ error });
  }

  const customer = await user.findOne({
    clinic_id: req.body.clinic_id,
    [`channels.${req.body.channel}.profile_info.${indicator}`]:
      req.body.contact_data?.[indicator],
  });

  if (!customer) return res.status(404).json({ error: "Customer not found" });
  const messages = customer.channels[req.body.channel].messages;
  const fresh_messages = messages.filter(
    (message) => message.fresh && message.role === "agent"
  );
  if (fresh_messages.length === 0)
    return res.status(404).json({ error: "No fresh messages" });

  await user.updateOne(
    {
      clinic_id: req.body.clinic_id,
      [`channels.${req.body.channel}.profile_info.${indicator}`]:
        req.body.contact_data?.[indicator],
    },
    {
      $set: {
        [`channels.${req.body.channel}.messages.$[elem].fresh`]: false,
      },
    },
    {
      arrayFilters: [
        {
          "elem.fresh": true,
        },
      ],
    }
  );
  return res.status(200).json({
    version: "v2",
    content: {
      type: req.body.channel,
      messages: fresh_messages.map((message) => ({
        type: message.type,
        text: message.content,
      })),

      actions: [],
      quick_replies: [],
    },
  });
});

export default router;
