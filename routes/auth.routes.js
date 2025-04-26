import express from "express";
import AuthController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signin", AuthController.SignIn);
router.post("/signup", AuthController.SignUp);

export default router;
