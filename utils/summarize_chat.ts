import OpenAI from "openai";
import dotenv from "dotenv";
import { MESSAGE_SENDER_TYPES } from "#constants/messageSenderTypes.js";
import ApiError from "./api/ApiError.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type SummarizeChat = (messages: any[]) => Promise<string>;
export const summarizeChat: SummarizeChat = async (messages: any[]) => {
  const chatMessages = [
    {
      role: "system",
      content:
        "Sen bir diş kliniği müşteri temsilcisisin. Aşağıdaki konuşmayı özetle. Kısa ve bilgilendirici bir özet ver.",
    },
    ...messages.map((msg) => ({
      role: msg.sender === MESSAGE_SENDER_TYPES.CLIENT ? "user" : "assistant",
      content: msg.text,
    })),
  ];

  const completion: OpenAI.Chat.Completions.ChatCompletion =
    await openai.chat.completions.create({
      model: "gpt-4",
      messages:
        chatMessages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      temperature: 0.5,
    });

  const summary = completion.choices[0].message.content;
  if (!summary)
    throw new ApiError(500, "Chat summarization could not be generated.");
  return summary;
};
