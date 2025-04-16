import clinic from "../../db/models/clinic.js";

export default async function getMe(userId) {
  try {
    const user = await clinic.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      userId: user._id,
      name: user.name,
      email: user.email,
      logo: user.logo,
    };
  } catch {
    return null;
  }
}
