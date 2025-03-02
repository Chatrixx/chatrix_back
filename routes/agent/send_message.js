import express from "express";
import OpenAI from "openai";
import clinic from "../../db/models/clinic.js";
import manychat from "../../db/models/manychat/manychat.js";
import user from "../../db/models/user.js";
import dbConnect from "../../db/mongodb.js";
import dotenv from "dotenv";
import { getChannelIndicator } from "../../util/channel.js";

dotenv.config();

const router = express.Router();
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

router.post("/", async (req, res) => {
  if (!req.body.input)
    return res.status(400).json({ error: "Input is required" });
  const indicator = getChannelIndicator(req.body.channel) ?? null;
  try {
    await dbConnect();
    await manychat.create(req.body);

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

    const answer = await reply({
      input,
      threadId: customer ? customer.channels[contact_channel].thread_id : null,
      assistantId: clinic_assistant_id,
    });

    const user_message = {
      content: input,
      type: "text",
      timestamp: new Date(),
      fresh: true,
      role: "user",
    };
    const agent_message = {
      content: answer.messages?.body?.data?.[0]?.content[0]?.text?.value,
      type: "text",
      timestamp: new Date(),
      fresh: true,
      role: "agent",
    };

    if (!customer) {
      await user.create({
        full_name:
          req.body.contact_data.full_name ??
          `${req.body.contact_data.first_name} ${req.body.contact_data.last_name}`,
        email: req.body.email,
        phone: req.body.phone,
        clinic_id: req.body.clinic_id,
        profile_pic: req.body.contact_data.profile_pic,
        initial_channel: contact_channel,
        channels: {
          [contact_channel]: {
            profile_info: {
              [indicator]: req.body.contact_data?.[indicator],
              name: req.body.contact_data.full_name,
              profile_pic: req.body.contact_data.profile_pic,
            },
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
          },
          $push: {
            [`channels.${contact_channel}.messages`]: {
              $each: [user_message, agent_message],
            },
          },
        }
      );
    }

    res.status(404).json({
      message: "Message created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
