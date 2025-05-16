import { CHANNELS } from "#constants/channels.js";
const CHANNELS_PRIMARYKEYS = {
    [CHANNELS.INSTAGRAM]: "ig_username",
    [CHANNELS.WHATSAPP]: "phone",
};
export const getChannelPrimaryKey = (channel) => {
    if (!channel || !Object.values(CHANNELS).includes(channel))
        throw new Error("Invalid channel");
    return CHANNELS_PRIMARYKEYS[channel];
};
