import MeController from "#controllers/me.controller.js";
import exporess from "express";

const router = exporess.Router();

router.get("/getMe", MeController.Getme);

export default router;
