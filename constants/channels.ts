export const CHANNELS = {
  INSTAGRAM: "instagram",
  WHATSAPP: "whatsapp",
} as const;

export type IChannel = (typeof CHANNELS)[keyof typeof CHANNELS];
