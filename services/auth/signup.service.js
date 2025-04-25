import clinic from "../../db/models/clinic.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../../utils/api/ApiError.js";

export default async function signup({ email, password }) {
  const exists = await clinic.findOne({ email });
  if (exists) throw new ApiError(400, "Bu email kullanılmakta");
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new clinic({ email, password: hashedPassword });
  await user.save();
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
}
