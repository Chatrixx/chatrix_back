import exporess from "express";
import UserController from "../controllers/user.controller.js";

const router = exporess.Router();

router.get("/me", UserController.Getme);

export default router;
