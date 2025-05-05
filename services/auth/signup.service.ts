import clinic from "#db/models/Clinic.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "#utils/api/ApiError.js";

interface Parameters {
  email: string;
  password: string;
}

export default async function signup({ email, password }: Parameters) {
  const exists = await clinic.findOne({ email });
  if (exists) throw new ApiError(400, "Bu email kullanılmakta");
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new clinic({ email, password: hashedPassword });
  await user.save();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
  return token;
}
