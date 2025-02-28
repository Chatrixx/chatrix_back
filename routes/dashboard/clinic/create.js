import express from "express";
import dbConnect from "../../../db/mongodb.js";
import Clinic from "../../../db/models/clinic.js";
import { formatBadRequest } from "../../../util/api.js";

const router = express.Router();

router.post("/", async (req, res) => {
  await dbConnect();
  try {
    const item = await Clinic.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, error: formatBadRequest(error) });
  }
});

export default router;
