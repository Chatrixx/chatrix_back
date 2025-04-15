import express from "express";
import AgentController from "../controllers/agent.controller.js";

const router = express.Router();

router.post("/send_message", AgentController.sendMessage);
router.post("/get_fresh_messages", AgentController.getFreshMessages);

export default router;
