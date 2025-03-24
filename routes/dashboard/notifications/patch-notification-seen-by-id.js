import express from "express";
const router = express.Router();
import Notification from "../../../db/models/notification.js";

router.patch("/:id/seen", async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    notification.seen = true;
    await notification.save();

    res.json({ success: true, notification });
  } catch (err) {
    console.error("Failed to update notification:", err);
    res.status(500).json({ error: "Failed to update seen status" });
  }
});

export default router;
