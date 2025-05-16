import TestController from "#controllers/test.controller.js";
import express from "express";
const router = express.Router();
router.post("/send_message", TestController.SendMessage);
router.get("/get_all_messages", TestController.GetAllMessages);
export default router;
