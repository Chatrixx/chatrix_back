export const MESSAGE_SENDER_TYPES = {
  CHATRIX_AUTO_MESSAGE: "chatrix_auto_message",
  CLIENT: "client",
  CHATRIX_MANUAL_MESSAGE: "chatrix_manual_message",
} as const;

export type IMessageSenderType =
  (typeof MESSAGE_SENDER_TYPES)[keyof typeof MESSAGE_SENDER_TYPES];
