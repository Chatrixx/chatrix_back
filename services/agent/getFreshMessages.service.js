import user from "../../db/models/User.js";
import { getChannelIndicator } from "../../utils/channel.js";
import ApiError from "../../utils/api/ApiError.js";

export default async function getFreshMessages(body, clinic_id) {
  const indicator = getChannelIndicator(body.channel) ?? null;

  if (!clinic_id) {
    throw new ApiError(400, "clinic_id is required");
  }

  if (!body.channel) {
    throw new ApiError(400, "channel is required");
  }

  if (!indicator) {
    throw new ApiError(400, "Invalid channel");
  }

  if (!body.contact_data?.[indicator]) {
    throw new ApiError(400, `${indicator} is required`);
  }

  const customer = await user.findOne({
    clinic_id,
    [`channels.${body.channel}.profile_info.${indicator}`]:
      body.contact_data?.[indicator],
  });

  if (!customer) {
    throw new ApiError(400, `No such user`);
  }

  const messages = customer.channels[body.channel].messages;
  const fresh_messages = messages.filter(
    (message) => message.fresh && message.role === "agent"
  );

  if (fresh_messages.length === 0) {
    throw new ApiError(404, "No fresh messages.");
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
  };
}
