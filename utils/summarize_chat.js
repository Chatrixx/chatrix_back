import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function summarizeChat(messages) {
  const chatMessages = [
    {
      role: "system",
      content: "Sen bir diş kliniği müşteri temsilcisisin. Aşağıdaki konuşmayı özetle. Kısa ve bilgilendirici bir özet ver."
    },
    ...messages.map(msg => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text
    }))
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4", 
    messages: chatMessages,
    temperature: 0.5
  });

  return completion.choices[0].message.content;
}
