import Clinic from "#db/models/Clinic.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "#utils/api/ApiError.js";

interface Parameters {
  email: string;
  password: string;
}

export default async function signin({ email, password }: Parameters) {
  const user = await Clinic.findOne({ email });
  const isMatch = user ? await bcrypt.compare(password, user.password) : false;

  if (!isMatch || !user) {
    throw new ApiError(401, "Hatalı email veya kullanıcı adı.");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
  return token;
}
