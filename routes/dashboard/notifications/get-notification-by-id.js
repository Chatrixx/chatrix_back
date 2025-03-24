import express from "express";
const router = express.Router();
import Notification from "../../../db/models/notification.js";

router.get("/:id", async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(notification);
  } catch (err) {
    console.error("Fetch by ID error:", err);
    res.status(500).json({ error: "Failed to fetch notification" });
  }
});

export default router;
