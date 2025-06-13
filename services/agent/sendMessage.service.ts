import { IChannel } from "#constants/channels.js";
import { MESSAGE_SENDER_TYPES } from "#constants/messageSenderTypes.js";
import { NOTIFICATION_TYPES } from "#constants/notificationTypes.js";
import Client, { ClientDocument } from "#db/models/Client.js";
import Clinic from "#db/models/Clinic.js";
import createNotification from "#services/notifications/create.service.js";
import { IManyChatInstagramPayload } from "#types/manychat.js";
import ApiError from "#utils/api/ApiError.js";
import { getChannelPrimaryKey } from "#utils/channel.js";
import { removeEmojisAndExclamations } from "#utils/message.js";
import { createOpenAiClient, getOpenAiReply } from "#utils/openai/index.js";
import { extractTurkishPhoneNumber } from "#utils/phone.js";
import { summarizeChat } from "#utils/summarize_chat.js";

const pendingResponses = new Map();

const openaiClient = createOpenAiClient();

const MAX_MESSAGE_INTERARRIVAL_DURATION = 12000;

const TEST_MODE = true;

// Helper Functions -------------------
async function sendSummaryIfTriggered(
  input: string,
  clinic_id: string,
  client: ClientDocument,
  contact_channel: IChannel,
  messages: any[]
) {
  const phoneNumber = extractTurkishPhoneNumber(input);
  if (!phoneNumber || !(messages.length > 0)) return;
  const formatted = messages.map((msg) => ({
    sender:
      msg.role === MESSAGE_SENDER_TYPES.CHATRIX_AUTO_MESSAGE
        ? "assistant"
        : "client",
    text: msg.content,
  }));
  const summary = TEST_MODE
    ? `Test Summary date: ${new Date().toLocaleDateString("tr-TR")}`
    : await summarizeChat(formatted);

  createNotification({
    body: {
      summary,
      phoneNumber,
      clientId: client._id,
      channel: contact_channel,
    },
    title: `${client.full_name ?? "UNKWNON USER"} telefon numarası sağladı.`,
    notification_type: NOTIFICATION_TYPES.PHONE_NUMBER_GIVEN,
    clinic_id,
  });
}

async function getAggregatedReply(clientKey: string, assistantId: string) {
  if (pendingResponses.has(clientKey)) {
    const { messages, threadId } = pendingResponses.get(clientKey);
    // const mergedMessages = addLeadingNameToMessage(messages.join(" "));
    const mergedMessages = messages?.join(" "); //TODO: Fix the above line's logic and use its
    pendingResponses.delete(clientKey);

    const answer = await getOpenAiReply(
      mergedMessages,
      threadId,
      assistantId,
      openaiClient
    );

    return { answer, messages };
  } else {
    return null;
  }
}
// ------------------------------------------------------------

export default async function sendMessage(
  body: IManyChatInstagramPayload,
  clinic_id: string
) {
  if (!body.input) {
    return { status: 400, data: { error: "Input is required" } };
  }

  const channelPrimaryKey = getChannelPrimaryKey(body.channel);

  const related_clinic = await Clinic.findById(clinic_id);

  const clinic_assistant_id = related_clinic?.openai_assistant?.assistant_id;

  const contact_channel = body.channel;
  const { input } = body;

  let client = await Client.findOne({
    [`channels.${body.channel}.profile_info.${channelPrimaryKey}`]:
      body.contact_data[channelPrimaryKey],
    clinic_id: clinic_id,
  });

  if (!client) {
    const clientFullName =
      body.full_name ??
      `${body.contact_data.first_name ?? ""} ${
        body.contact_data.last_name ?? ""
      }`;

    client = await Client.create({
      full_name: clientFullName,
      email: body.contact_data.email,
      phone: body.contact_data.phone,
      clinic_id: body.clinic_id,
      profile_pic: body.contact_data.profile_pic,
      initial_channel: contact_channel,
      channels: {
        [contact_channel]: {
          profile_info: {
            [channelPrimaryKey]: body.contact_data[channelPrimaryKey],
            full_name: clientFullName,
            profile_pic: body.contact_data.profile_pic,
            phone: body.contact_data.phone ?? null,
          },
          phone_giving_date: null,
          first_message_date: new Date(),
          last_message_date: new Date(),
        },
      },
    });
  }

  if (!client.channels)
    throw new ApiError(500, "Client does not have channels object.");

  const uniqueClientKey = `${clinic_id}_${
    client.channels[contact_channel]?.profile_info?.[
      channelPrimaryKey
    ] as string
  }`;

  const channelData = client.channels[contact_channel];
  const messages = channelData?.messages || [];

  sendSummaryIfTriggered(input, clinic_id, client, contact_channel, messages);

  const handleSendReply = async () => {
    const aggregatedResponse = await getAggregatedReply(
      uniqueClientKey,
      clinic_assistant_id
    );

    const answer = aggregatedResponse?.answer;
    const client_messages = aggregatedResponse?.messages;
    if (!answer) {
      throw new ApiError(500, "Internal Server Error");
    }

    const agent_message_object = {
      content: removeEmojisAndExclamations(answer?.content),
      type: "text",
      timestamp: new Date(),
      fresh: true,
      role: "agent",
    };

    const client_message_objects = client_messages.map((m: string) => ({
      content: m,
      type: "text",
      timestamp: new Date(),
      fresh: true,
      sender: MESSAGE_SENDER_TYPES.CLIENT,
    }));

    const phoneFromMessage = extractTurkishPhoneNumber(input);

    await Client.updateOne(
      { _id: client._id },
      {
        $set: {
          [`channels.${contact_channel}.thread_id`]: answer.thread_id,
          [`channels.${contact_channel}.last_updated`]: new Date(),
          [`channels.${contact_channel}.last_message_date`]: new Date(),
          ...(phoneFromMessage && {
            phone: phoneFromMessage,
            [`channels.${contact_channel}.profile_info.phone`]:
              phoneFromMessage,
            [`channels.${contact_channel}.phone_giving_date`]: new Date(),
          }),
        },
        $push: {
          [`channels.${contact_channel}.messages`]: {
            $each: [...client_message_objects, agent_message_object],
          },
        },
      }
    );

    return true;
  };

  if (pendingResponses.has(uniqueClientKey)) {
    const pending = pendingResponses.get(uniqueClientKey);
    pending.messages.push(input);
    clearTimeout(pending.timeout);
    pending.timeout = setTimeout(() => {
      handleSendReply();
    }, MAX_MESSAGE_INTERARRIVAL_DURATION);
  } else {
    const messages = [input];
    const timeout = setTimeout(() => {
      handleSendReply();
    }, MAX_MESSAGE_INTERARRIVAL_DURATION);
    pendingResponses.set(uniqueClientKey, {
      messages,
      timeout,
      threadId: client.channels[contact_channel]?.thread_id,
    });
  }

  return { message: "Message received and will be handled soon." };
}
