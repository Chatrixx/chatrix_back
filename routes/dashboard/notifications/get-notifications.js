import express from "express";
import dbConnect from "../../../db/mongodb.js";
import clinic from "../../../db/models/clinic.js";
const router = express.Router();

router.get("/", async (req, res) => {
  await dbConnect();
  const { clinic_id } = req.query;
  const clinic_res = await clinic.findOne({ clinic_id: clinic_id });
  if (!clinic_res) {
    return res.status(400).json({ success: false, error: "clinic not found" });
  }
  try {
    if (!clinic_id) {
      return res
        .status(400)
        .json({ success: false, error: "clinic_id is required" });
    }
    const notifications = clinic_res?.notifications;

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

export default router;
