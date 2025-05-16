import SseController from "#controllers/sse.controller.js";
import express from "express";
const router = express.Router();
router.get("/sse", SseController.CreateConnection);
export default router;
