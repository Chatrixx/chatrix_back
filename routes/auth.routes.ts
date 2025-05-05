import AuthController from "#controllers/auth.controller.js";
import express from "express";

const router = express.Router();

router.post("/signin", AuthController.SignIn);
router.post("/signup", AuthController.SignUp);

export default router;
