import Clinic from "../../db/models/Clinic.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../../utils/api/ApiError.js";

export default async function signin({ email, password }) {
  const user = await Clinic.findOne({ email });
  const isMatch = user ? await bcrypt.compare(password, user?.password) : false;
  if (!isMatch || !user) {
    throw new ApiError(401, "Hatalı email veya kullanıcı adı.");
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
}
