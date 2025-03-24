import express from "express";
const router = express.Router();
import Notification from "../../../db/models/notification.js";

router.patch("/mark-all-seen", async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { seen: false }, // Sadece görülmemiş olanları güncelle
      { $set: { seen: true } }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} notifications marked as seen.`,
    });
  } catch (err) {
    console.error("Mark all as seen error:", err);
    res.status(500).json({ error: "Failed to mark notifications as seen" });
  }
});

export default router;
