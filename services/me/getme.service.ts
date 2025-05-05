import Clinic from "#db/models/Clinic.js";
import ApiError from "#utils/api/ApiError.js";

export default async function getMe(userId: string) {
  const user = await Clinic.findById(userId).orFail(() => {
    throw new ApiError(404, "No user with given id.");
  });

  return {
    userId: user._id,
    name: user.name,
    email: user.email,
    logo: user.logo,
  };
}
