import express from "express";
import AssistantController from "../controllers/assistant.controller.js";

const router = express.Router();

// OpenAI instruction management
router.post("/instructions", AssistantController.getInstructions);
router.put("/instructions", AssistantController.updateInstructions);

export default router;
