import clinic from "../../db/models/Clinic.js";
import User from "../../db/models/User.js";
import { summarizeChat } from "../../utils/summarize_chat.js";
import { getChannelIndicator } from "../../utils/channel.js";
import { extractTurkishPhoneNumber } from "../../utils/phone.js";
import {
  addLeadingNameToMessage,
  removeEmojisAndExclamations,
} from "../../utils/message.js";

import {
  createOpenAiClient,
  getOpenAiReply,
} from "../../utils/openai/index.js";
import insertNotification from "../notifications/create.service.js";
import { NOTIFICATION_TYPES } from "../../constants/notificationTypes.js";
import ApiError from "../../utils/api/ApiError.js";

let pendingResponses = new Map();

const openaiClient = createOpenAiClient();

const MAX_MESSAGE_INTERARRIVAL_DURATION = 5500;

async function getAggregatedReply(userKey, assistantId) {
  if (pendingResponses.has(userKey)) {
    const { messages, threadId } = pendingResponses.get(userKey);
    const mergedMessages = addLeadingNameToMessage(messages.join(" "));
    const answer = await getOpenAiReply({
      input: mergedMessages,
      threadId,
      assistantId,
      client: openaiClient,
    });
    pendingResponses.delete(userKey);
    return answer;
  }
  return null;
}

export default async function sendMessage(body, clinic_id) {
  if (!body.input) {
    return { status: 400, data: { error: "Input is required" } };
  }

  const indicator = getChannelIndicator(body.channel) ?? null;

  const related_clinic = await clinic.findById(clinic_id);

  const clinic_assistant_id = related_clinic?.openai_assistant?.assistant_id;

  const contact_channel = body.channel;
  const { input } = body;

  let customer = await User.findOne({
    [`channels.${body.channel}.profile_info.${indicator}`]:
      body.contact_data?.[indicator],
    clinic_id: clinic_id,
  });

  if (!customer) {
    customer = await User.create({
      full_name:
        body.contact_data.full_name ??
        `${body.contact_data.first_name} ${body.contact_data.last_name}`,
      email: body.email,
      phone: body.phone ?? null,
      clinic_id: body.clinic_id,
      profile_pic: body.contact_data.profile_pic,
      initial_channel: contact_channel,
      channels: {
        [contact_channel]: {
          profile_info: {
            [indicator]: body.contact_data?.[indicator],
            name: body.contact_data.full_name,
            profile_pic: body.contact_data.profile_pic,
            phone: body.phone ?? null,
          },
          phone_giving_date: null,
          first_message_date: new Date(),
          last_message_date: new Date(),
        },
      },
    });
  }
  const uniqueUserKey =
    customer.channels[contact_channel].profile_info[indicator];

  const phoneNumber = extractTurkishPhoneNumber(input);
  const channelData = customer?.channels?.[contact_channel];
  const messages = channelData?.messages || [];

  if (phoneNumber && messages.length > 0) {
    const formatted = messages.map((msg) => ({
      sender: msg.role === "agent" ? "assistant" : "user",
      text: msg.content,
    }));

    const summary = await summarizeChat(formatted);
    insertNotification({
      body: {
        summary,
        phoneNumber,
        userId: customer._id,
        channel: contact_channel,
      },
      notification_type: NOTIFICATION_TYPES.PHONE_NUMBER_GIVEN,
      clinic_id,
    });
  }

  const handleSendReply = async () => {
    const answer = await getAggregatedReply(uniqueUserKey, clinic_assistant_id);
    if (!answer) {
      throw new ApiError(500, "Internal Server Error");
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
      content: input,
      type: "text",
      timestamp: new Date(),
      fresh: true,
      role: "user",
    };

    const phoneFromMessage = extractTurkishPhoneNumber(input);

    await User.updateOne(
      { _id: customer._id },
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
            $each: [user_message, agent_message],
          },
        },
      }
    );

    return true;
  };

  if (pendingResponses.has(uniqueUserKey)) {
    const pending = pendingResponses.get(uniqueUserKey);
    pending.messages.push(input);
    clearTimeout(pending.timeout);
    pending.timeout = setTimeout(
      handleSendReply,
      MAX_MESSAGE_INTERARRIVAL_DURATION
    );
  } else {
    const messages = [input];
    const timeout = setTimeout(
      handleSendReply,
      MAX_MESSAGE_INTERARRIVAL_DURATION
    );
    pendingResponses.set(uniqueUserKey, {
      messages,
      timeout,
      threadId: customer?.channels[contact_channel]?.thread_id,
    });
  }

  return { message: "Message received and will be handled soon." };
}
