import clinic from "../../db/models/clinic.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function signin({ email, password }) {
  try {
    const user = await clinic.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { message: "Invalid credentials" };
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    return token;
  } catch (err) {
    return { error: err.message };
  }
}
