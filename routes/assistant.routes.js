import express from "express";
import AssistantController from "../controllers/assistant.controller.js";

const router = express.Router();

// OpenAI instruction management
router.post("/instructions", AssistantController.getInstructions); // body: { clinic_id }
router.put("/instructions", AssistantController.updateInstructions); // body: { clinic_id, instructions }

export default router;
