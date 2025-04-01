import { CHANNELS } from "../../constants/channels.js";
import User from "../../db/models/user.js";

export default async function getChatsByUser({ user_id, channel }) {
  try {
    // Ensure the channel is valid
    if (!Object.values(CHANNELS).includes(channel)) {
      throw new Error("Invalid channel. Must be 'instagram' or 'whatsapp'.");
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
  } catch (error) {
    console.error("Error fetching user chat by channel:", error);
    throw new Error("Failed to fetch chat messages");
  }
}
