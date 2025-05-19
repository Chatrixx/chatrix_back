import Notification from "#db/models/Notification.js";
import ApiError from "#utils/api/ApiError.js";
import { MongoObjectId } from "#utils/mongoose/casters.js";

interface Parameters {
  notification_id: string;
}
export default async function getNotificationById({
  notification_id,
}: Parameters) {
  const notification = await Notification.findById(
    MongoObjectId(notification_id)
  ).orFail(() => {
    throw new ApiError(404, "No notification found with given id.");
  });
  return notification;
}
