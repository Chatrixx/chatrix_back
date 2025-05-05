import OpenAI from "openai";

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

  // TODO: Handle efficiently later instead of checking all runs's status
  // await waitForRunCompletion({ thread_id, client });
  await createOpenAiMessage(client, thread_id, {
    role: "user",
    content: input,
  });
  const run = await createOpenAiRun(thread_id, assistantId, client);

  while (run.status !== "completed") {
    if (run.status === "failed")
      return { messages: null, status: run.status, error: run.last_error };
    await new Promise((r) => setTimeout(r, 1000));
  }

  const messages = await client.beta.threads.messages.list(run.thread_id);
  return { messages, status: run.status, thread_id };
};
