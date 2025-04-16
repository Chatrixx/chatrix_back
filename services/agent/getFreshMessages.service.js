import user from "../../db/models/User.js";
import { getChannelIndicator } from "../../utils/channel.js";

export default async function getFreshMessages(body, clinic_id) {
  const indicator = getChannelIndicator(body.channel) ?? null;

  if (!clinic_id) {
    return { status: 400, data: { error: "clinic_id is required" } };
  }

  if (!body.channel) {
    return { status: 400, data: { error: "channel is required" } };
  }

  if (!indicator) {
    return { status: 400, data: { error: "Invalid channel" } };
  }

  if (!body.contact_data?.[indicator]) {
    return {
      status: 400,
      data: { error: `${indicator} is required` },
    };
  }

  const customer = await user.findOne({
    clinic_id,
    [`channels.${body.channel}.profile_info.${indicator}`]:
      body.contact_data?.[indicator],
  });

  if (!customer) {
    return { status: 404, data: { error: "Customer not found" } };
  }

  const messages = customer.channels[body.channel].messages;
  const fresh_messages = messages.filter(
    (message) => message.fresh && message.role === "agent"
  );

  if (fresh_messages.length === 0) {
    return { status: 404, data: { error: "No fresh messages" } };
  }

  await user.updateOne(
    {
      clinic_id,
      [`channels.${body.channel}.profile_info.${indicator}`]:
        body.contact_data?.[indicator],
    },
    {
      $set: {
        [`channels.${body.channel}.messages.$[elem].fresh`]: false,
      },
    },
    {
      arrayFilters: [{ "elem.fresh": true }],
    }
  );

  return {
    status: 200,
    data: {
      version: "v2",
      content: {
        type: body.channel,
        messages: fresh_messages.map((message) => ({
          type: message.type,
          text: message.content,
        })),
        actions: [],
        quick_replies: [],
      },
    },
  };
}
