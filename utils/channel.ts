import { CHANNELS, IChannel } from "#constants/channels.js";

const CHANNELS_PRIMARYKEYS = {
  [CHANNELS.INSTAGRAM]: "ig_username",
  [CHANNELS.WHATSAPP]: "phone",
} as const;

type IPrimaryKey =
  (typeof CHANNELS_PRIMARYKEYS)[keyof typeof CHANNELS_PRIMARYKEYS];

export const getChannelPrimaryKey: (channel?: IChannel) => IPrimaryKey = (
  channel
) => {
  if (!channel || !Object.values(CHANNELS).includes(channel))
    throw new Error("Invalid channel");

  return CHANNELS_PRIMARYKEYS[channel];
};
