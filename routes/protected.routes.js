import express from "express";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/dashboard", auth, (req, res) => {
  res.json({ message: `Welcome user ${req.user.userId}` });
});

export default router;
