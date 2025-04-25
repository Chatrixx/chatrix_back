import Notification from "../../db/models/Notification.js";
import ApiError from "../../utils/api/ApiError.js";

export default async function getAllNotifications({ clinic_id }) {
  return await Notification.find({ clinic_id })
    .orFail(() => {
      throw new ApiError(404, "No clinic found with given id.");
    })
    .sort({
      date: -1,
    });
}
