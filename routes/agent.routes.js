import express from "express";
import AgentController from "../controllers/agent.controller.js";

const router = express.Router();

router.post("/send_message", AgentController.SendMessage);
router.post("/get_fresh_messages", AgentController.GetFreshMessages);

export default router;
