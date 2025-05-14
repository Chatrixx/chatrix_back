import OpenAI from "openai";

interface QueuedMessage {
  content: string;
  assistantId: string;
  resolve: (data: any) => void;
  reject: (error: any) => void;
}

const queues = new Map<string, QueuedMessage[]>();
const processingThreads = new Set<string>();

export async function enqueueMessage(
  client: OpenAI,
  threadId: string,
  assistantId: string,
  content: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const queue = queues.get(threadId) || [];
    queue.push({ content, assistantId, resolve, reject });
    queues.set(threadId, queue);

    if (!processingThreads.has(threadId)) {
      processQueue(threadId, client);
    }
  });
}

async function processQueue(threadId: string, client: OpenAI) {
  processingThreads.add(threadId);

  const queue = queues.get(threadId);
  if (!queue) return;

  while (queue.length > 0) {
    const { content, assistantId, resolve, reject } = queue[0];

    try {
      await waitForActiveRun(threadId, client);

      // 1. Send message
      await client.beta.threads.messages.create(threadId, {
        role: "user",
        content,
      });

      // 2. Create run
      const run = await client.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: assistantId,
      });

      // 3. Wait for run to complete
      if (run.status !== "completed") {
        throw new Error("Run failed or incomplete");
      }

      // 4. Get messages
      const messages = await client.beta.threads.messages.list(threadId);

      resolve({
        messages: messages.data,
        thread_id: threadId,
        status: run.status,
      });
    } catch (err) {
      reject(err);
    }

    // Remove processed message
    queue.shift();
  }

  processingThreads.delete(threadId);
  queues.delete(threadId);
}

async function waitForActiveRun(threadId: string, client: OpenAI) {
  const runs = await client.beta.threads.runs.list(threadId);
  const active = runs.data.find(
    (r) => r.status === "queued" || r.status === "in_progress"
  );

  if (!active) return;

  while (true) {
    const current = await client.beta.threads.runs.retrieve(active.id, threadId);
    if (current.status === "completed" || current.status === "failed") break;
    await new Promise((r) => setTimeout(r, 1000));
  }
}
