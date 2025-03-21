import { CHANNELS } from "../enum/channels.js";

export const getChannelIndicator = (channel) => {
  if (!channel) throw new Error("Channel is required");

  if (!Object.values(CHANNELS).includes(channel))
    throw new Error("Invalid channel");

  if (channel === CHANNELS.INSTAGRAM) return "ig_username";
  if (channel === CHANNELS.WHATSAPP) return "phone"; // TODO: This is temp
};
