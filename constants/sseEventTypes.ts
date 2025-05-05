export const SSE_EVENT_TYPES = {
  NOTIFICATION: "notification",
} as const;

export type ISseEventType =
  (typeof SSE_EVENT_TYPES)[keyof typeof SSE_EVENT_TYPES];
