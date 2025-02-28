import express from "express";
import user from "../../../db/models/user.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { channel = "instagram" } = req.query;

  try {
    const users = await user
      .find({ [`channels.${channel}.last_updated`]: { $exists: true } })
      .sort({ [`channels.${channel}.last_updated`]: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

export default router;
