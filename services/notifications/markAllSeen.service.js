import Notification from "../../db/models/Notification.js";
export default async function markAllSeen({ clinic_id }) {
  try {
    const result = await Notification.updateMany(
      { clinic_id: clinic_id, seen: false }, // Only update unseen notifications
      { $set: { seen: true } }
    );

    return result.modifiedCount; // Return the number of updated notifications
  } catch (error) {
    console.error("Error marking all notifications as seen:", error);
    throw error;
  }
}
