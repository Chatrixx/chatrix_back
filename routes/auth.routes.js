import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import clinic from "../db/models/clinic.js";

const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

// Sign Up
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const exists = await clinic.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new clinic({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sign In
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await clinic.findOne({ email });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
