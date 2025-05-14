import * as dotenv from "dotenv";
import * as path from "path";
// Tell dotenv to look for .env in project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import { createOpenAiClient, createOpenAiThread } from "../utils/openai/index.js";
import { enqueueMessage } from "../utils/openai/threadQueueManager.js";
const assistantId = "asst_GY55jnlwDLWxKJUJJcS3musx"; // 🟡 Replace this with your real assistant ID
async function testQueue() {
    const client = createOpenAiClient();
    // 🟢 Create thread dynamically
    const thread = await createOpenAiThread(client);
    const threadId = thread.id;
    const messages = [
        "1️⃣ First message",
        "2️⃣ Second message",
        "3️⃣ Third message",
    ];
    const promises = messages.map((msg) => enqueueMessage(client, threadId, assistantId, msg).then((res) => {
        console.log(`✅ Response for: "${msg}"`);
        console.log(res.messages[0].content); // or log full messages
    }));
    await Promise.all(promises); // All run in parallel, but queue handles order
}
testQueue().catch(console.error);
