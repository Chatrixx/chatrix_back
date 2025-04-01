import Notification from "../../db/models/notification.js";

export default async function getNotificationById({ notification_id }) {
  try {
    const notification = await Notification.findById(notification_id);
    return notification;
  } catch (error) {
    console.error("Error fetching notification by ID:", error);
    throw new Error("Failed to fetch notification");
  }
}
