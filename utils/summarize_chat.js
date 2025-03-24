import OpenAI from "openai";

const openai = new OpenAI({
  apiKey:
    "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",
});

export async function summarizeChat(messages) {
  const chatMessages = [
    {
      role: "system",
      content:
        "Sen bir diş kliniği müşteri temsilcisisin. Aşağıdaki konuşmayı özetle. Kısa ve bilgilendirici bir özet ver.",
    },
    ...messages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    })),
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: chatMessages,
    temperature: 0.5,
  });

  return completion.choices[0].message.content;
}
