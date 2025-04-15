import express from "express";
import AuthController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signin", AuthController.Signin);
router.post("/signup", AuthController.Signup);

export default router;
