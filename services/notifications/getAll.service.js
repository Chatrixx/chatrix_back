import Notification from "../../db/models/Notification.js";

export default async function getAllNotifications({ clinic_id }) {
  try {
    return await Notification.find({ clinic_id }).sort({ date: -1 }); // Newest first
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}
