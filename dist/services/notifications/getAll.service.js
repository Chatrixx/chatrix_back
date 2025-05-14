import Notification from "#db/models/Notification.js";
export default async function getAllNotifications({ clinic_id }) {
    return await Notification.find({ clinic_id }).sort({
        date: -1,
    });
}
