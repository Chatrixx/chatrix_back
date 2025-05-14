import OpenAI from "openai";
import { enqueueMessage } from "./threadQueueManager.js";

export const createOpenAiClient = () =>
  new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const createOpenAiThread = async (client: OpenAI) =>
  await client.beta.threads.create();

export const createOpenAiMessage = async (
  client: OpenAI,
  thread_id: string,
  message: OpenAI.Beta.Threads.Messages.MessageCreateParams
) => {
  if (!message.content) throw new Error("Message Content is Required");
  if (!thread_id) throw new Error("Thread id is required");
  return await client.beta.threads.messages.create(thread_id, {
    role: message.role,
    content: message.content,
  });
};

export const createOpenAiRun = async (
  threadId: string,
  assistantId: string,
  client: OpenAI
) => {
  if (!assistantId) throw new Error("Assistant id is required");
  return await client.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: assistantId,
  });
};

export const getOpenAiReply = async (
  input: string,
  threadId: string,
  assistantId: string,
  client: OpenAI
) => {
  if (!input) return;

  console.log("thread id", threadId);

  const thread_id = threadId ?? (await createOpenAiThread(client)).id;

  console.log("fixed thread_id:", thread_id);

  return await enqueueMessage(client, threadId, assistantId, input);
};

