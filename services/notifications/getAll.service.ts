import Notification from "#db/models/Notification.js";

interface Parameters {
  clinic_id: string;
}

export default async function getAllNotifications({ clinic_id }: Parameters) {
  return await Notification.find({ clinic_id }).sort({
    date: -1,
  });
}
