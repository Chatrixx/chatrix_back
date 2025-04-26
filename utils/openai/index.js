import OpenAI from "openai";

export const createOpenAiClient = () =>
  new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const createOpenAiThread = async ({ client }) =>
  await client.beta.threads.create();

export const createOpenAiMessage = async ({
  client,
  thread_id,
  messageContent = "Default message content",
  role = "user",
}) => {
  if (!thread_id) throw new Error("Thread id is required");
  return await client.beta.threads.messages.create(thread_id, {
    role,
    content: messageContent,
  });
};

export const createOpenAiRun = async ({ threadId, assistantId, client }) => {
  if (!assistantId) throw new Error("Assistant id is required");
  return await client.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: assistantId,
  });
};

export const getOpenAiReply = async ({
  input,
  threadId,
  assistantId,
  client,
}) => {
  if (!input) return;

  let thread_id = threadId || (await createOpenAiThread({ client })).id;

  // Creating message job and running it.
  await createOpenAiMessage({
    thread_id,
    messageContent: input,
    client,
  });
  const run = await createOpenAiRun({
    threadId: thread_id,
    assistantId,
    client,
  });

  while (run.status !== "completed") {
    if (run.status === "failed")
      return { messages: null, status: run.status, error: run.last_error };
    await new Promise((r) => setTimeout(r, 1000));
  }

  const messages = await client.beta.threads.messages.list(run.thread_id);
  return { messages, status: run.status, thread_id };
};
