import Notification from "#db/models/Notification.js";
import ApiError from "#utils/api/ApiError.js";
import { MongoObjectId } from "#utils/mongoose/casters";

interface Paremeters {
  notification_id: string;
}
export default async function markSeenById({ notification_id }: Paremeters) {
  const notification = await Notification.findByIdAndUpdate(
    MongoObjectId(notification_id),
    { $set: { seen: true } },
    { new: true } // Returning updated document
  );

  if (!notification) {
    throw new ApiError(400, "Notification not found");
  }

  return notification;
}
