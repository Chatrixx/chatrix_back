import Notification from "#db/models/Notification.js";
import ApiError from "#utils/api/ApiError.js";
export default async function markSeenById({ notification_id }) {
    const notification = await Notification.findByIdAndUpdate(notification_id, { $set: { seen: true } }, { new: true } // Returning updated document
    );
    if (!notification) {
        throw new ApiError(400, "Notification not found");
    }
    return notification;
}
