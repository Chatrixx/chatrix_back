import { CHANNELS } from "../../constants/channels.js";
import User from "../../db/models/User.js";
import ApiError from "../../utils/api/ApiError.js";

export default async function getChatsByUser({ user_id, channel }) {
  if (!Object.values(CHANNELS).includes(channel)) {
    throw new ApiError("Invalid channel. Must be 'instagram' or 'whatsapp'.");
  }

  // Find the user and select only the required channel's messages
  const user = await User.findById(user_id).select(
    `channels.${channel}.messages`
  );

  if (!user || !user.channels || !user.channels[channel]) {
    return null;
  }

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      channels: user.channels,
    },
    messages: user.channels[channel].messages,
  };
}
