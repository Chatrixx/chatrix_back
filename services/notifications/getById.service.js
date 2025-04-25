import Notification from "../../db/models/Notification.js";
import ApiError from "../../utils/api/ApiError.js";

export default async function getNotificationById({ notification_id }) {
  const notification = await Notification.findById(notification_id).orFail(
    () => {
      throw new ApiError(404, "No notification found with given id.");
    }
  );
  return notification;
}
