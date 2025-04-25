import Notification from "../../db/models/Notification.js";
import ApiError from "../../utils/api/ApiError.js";
export default async function markAllSeen({ clinic_id }) {
  const result = await Notification.updateMany(
    { clinic_id, seen: false }, // Only update unseen notifications
    { $set: { seen: true } }
  );

  const { modifiedCount } = result;

  if (!modifiedCount) {
    throw new ApiError(404, `No unseen notifications found for this clinic.`);
  }

  return modifiedCount;
}
