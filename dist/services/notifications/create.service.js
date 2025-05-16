import { SSE_EVENT_TYPES } from "#constants/sseEventTypes.js";
import Notification from "#db/models/Notification.js";
import { sendClientEvent } from "#sse/sseManager.js";
export default async function createNotification({ clinic_id, notification_type, body, title, }) {
    const notification = await Notification.create({
        clinic_id,
        type: notification_type,
        body,
        title,
        seen: false,
        date: new Date(),
    });
    sendClientEvent(SSE_EVENT_TYPES.NOTIFICATION, clinic_id, notification);
}
