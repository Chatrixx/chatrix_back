import express from "express";
const router = express.Router();
import Notification from "../../../db/models/notification.js"; // ES module style

router.post("/", async (req, res) => {
  try {
    const { title, type, body } = req.body;

    if (!title || !type || !body) {
      return res.status(400).json({ error: "title, type and body are required" });
    }

    const notification = new Notification({
      title,
      type,
      body,
      date: new Date(),
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    console.error("Notification creation error:", err);
    res.status(500).json({ error: "Failed to create notification" });
  }
});

export default router;
