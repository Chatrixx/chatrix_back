import AgentController from "#controllers/agent.controller.js";
import express from "express";
const router = express.Router();
router.post("/send_message", AgentController.SendMessage);
router.post("/get_fresh_messages", AgentController.GetFreshMessages);
export default router;
