import clinic from "../../db/models/clinic.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function signup({ email, password }) {
  try {
    const exists = await clinic.findOne({ email });
    if (exists) return { message: "User already exists" };

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new clinic({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return token;
  } catch (err) {
    return { error: err.message };
  }
}
