import clinic from "../../db/models/clinic.js";
import ApiError from "../../utils/api/ApiError.js";

export default async function getMe(userId) {
  const user = await clinic.findById(userId).orFail(() => {
    new ApiError(404, "No user with given id.");
  });

  return {
    userId: user._id,
    name: user.name,
    email: user.email,
    logo: user.logo,
  };
}
