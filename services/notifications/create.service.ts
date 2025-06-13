import { INotificationType } from "#constants/notificationTypes.js";
import { SSE_EVENT_TYPES } from "#constants/sseEventTypes.js";
import Notification from "#db/models/Notification.js";
import { sendClientEvent } from "#sse/sseManager.js";
import { sendTelegramBotMessage } from "#utils/telegram/sendBotMessage.js";

interface Parameters {
  clinic_id: string;
  notification_type: INotificationType;
  body: any;
  title: string;
}
export default async function createNotification({
  clinic_id,
  notification_type,
  body,
  title,
}: Parameters) {
  const notification = await Notification.create({
    clinic_id,
    type: notification_type,
    body,
    title,
    seen: false,
    date: new Date(),
  });
  sendClientEvent(SSE_EVENT_TYPES.NOTIFICATION, clinic_id, notification);
  sendTelegramBotMessage({ chatId: undefined, notification });
}
