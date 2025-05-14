import clinic from "#db/models/Clinic.js";
import TestClient from "#db/models/TestClient.js";

import { removeEmojisAndExclamations } from "#utils/message.js";

import { createOpenAiClient, getOpenAiReply } from "#utils/openai/index.js";

import ApiError from "#utils/api/ApiError.js";

const pendingResponses = new Map();

const openaiClient = createOpenAiClient();

const MAX_MESSAGE_INTERARRIVAL_DURATION = 5500;

async function getAggregatedReply(userKey: string, assistantId: string) {
  if (pendingResponses.has(userKey)) {
    const { messages, threadId } = pendingResponses.get(userKey);
    // const mergedMessages = addLeadingNameToMessage(messages.join(" "));
    const mergedMessages = messages.join(" "); //TODO: Fix the above line's logic and use its
    const answer = await getOpenAiReply(
      mergedMessages,
      threadId,
      assistantId,
      openaiClient
    );
    pendingResponses.delete(userKey);
    return answer;
  }
  return null;
}
// ------------------------------------------------------------

export default async function sendMessage(input: string, clinic_id: string) {
  if (!input) {
    return { status: 400, data: { error: "Input is required" } };
  }

  const related_clinic = await clinic.findById(clinic_id);

  const clinic_assistant_id = related_clinic?.openai_assistant?.assistant_id;

  let testUser = await TestClient.findOne({
    clinic_id,
  });

  if (!testUser) {
    testUser = await TestClient.create({
      clinic_id: clinic_id,
      messages: [],
    });
  }
  const uniqueUserKey = `${clinic_id}_TEST_USER`;

  const handleSendReply = async () => {
    const answer = (await getAggregatedReply(
      uniqueUserKey,
      clinic_assistant_id
    ));

    if (!answer) {
      throw new ApiError(500, "Internal Server Error");
    }

    const agent_reply = answer.messages.body?.data[0]?.content[0]?.text?.value;

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

    await TestClient.updateOne(
      { _id: testUser._id },
      {
        $set: {
          thread_id: answer.thread_id,
        },
        $push: {
          messages: {
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
      threadId: testUser.thread_id,
    });
  }

  return { message: "Message received and will be handled soon." };
}
