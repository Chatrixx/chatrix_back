export const NOTIFICATION_TYPES = {
  PHONE_NUMBER_GIVEN: "phone_data_given",
} as const;

export type INotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];
