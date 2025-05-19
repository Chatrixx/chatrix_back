import mongoose from "mongoose";
import Client from "#db/models/Client.js";
import { IManyChatInstagramPayload } from "#types/manychat.js";
import ApiError from "#utils/api/ApiError.js";
import { getChannelPrimaryKey } from "#utils/channel.js";

export default async function getFreshMessages(
  body: IManyChatInstagramPayload,
  clinic_id: string
) {
  const session = await mongoose.startSession();
  const channelPrimaryKey = getChannelPrimaryKey(body.channel);

  if (!clinic_id) {
    throw new ApiError(400, "clinic_id is required");
  }

  if (!body.contact_data[channelPrimaryKey]) {
    throw new ApiError(400, `${channelPrimaryKey} is required`);
  }

  let fresh_messages: { type: string; text: string }[] = [];

  try {
    await session.withTransaction(async () => {
      const client = await Client.findOne(
        {
          clinic_id,
          [`channels.${body.channel}.profile_info.${channelPrimaryKey}`]:
            body.contact_data[channelPrimaryKey],
        },
        null,
        { session }
      );

      if (!client) {
        throw new ApiError(400, `No such client`);
      }

      const messages = client.channels?.[body.channel]?.messages;
      const all_fresh = messages?.filter(
        (message) => message.fresh && message.role === "agent"
      );

      if (!all_fresh || all_fresh.length === 0) {
        return;
      }

      fresh_messages = all_fresh.map((message) => ({
        type: message.type,
        text: message.content,
      }));

      // Güncelleme işlemi sadece transaction içinde
      await Client.updateOne(
        {
          clinic_id,
          [`channels.${body.channel}.profile_info.${channelPrimaryKey}`]:
            body.contact_data[channelPrimaryKey],
        },
        {
          $set: {
            [`channels.${body.channel}.messages.$[elem].fresh`]: false,
          },
        },
        {
          arrayFilters: [{ "elem.fresh": true, "elem.role": "agent" }],
          session,
        }
      );
    });

    return {
      version: "v2",
      content: {
        type: body.channel,
        messages: fresh_messages,
        actions: [],
        quick_replies: [],
      },
    };
  } catch (err) {
    console.error("Transaction failed:", err);
    throw err;
  } finally {
    await session.endSession();
  }
}
