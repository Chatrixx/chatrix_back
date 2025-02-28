import express from "express";
import clinic from "../../db/models/clinic.js";
import dbConnect from "../../db/mongodb.js";
import { formatBadRequest } from "../../util/api.js";

const router = express.Router();

router.get("/", async (req, res) => {
  await dbConnect();
  try {
    const clinics = await clinic.find();
    res.status(200).json({ success: true, data: clinics[0] });
  } catch (error) {
    res.status(400).json({ success: false, error: formatBadRequest(error) });
  }
});

export default router;
