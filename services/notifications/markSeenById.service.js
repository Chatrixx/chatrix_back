import Notification from "../../db/models/Notification.js";
export default async function markSeenById({ notification_id }) {
  try {
    const notification = await Notification.findByIdAndUpdate(
      notification_id,
      { $set: { seen: true } },
      { new: true } // Return updated document
    );

    if (!notification) {
      throw new Error("Notification not found");
    }

    return notification;
  } catch (error) {
    console.error("Error marking notification as seen:", error);
    throw error;
  }
}
