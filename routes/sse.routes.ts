import SseController from "#controllers/sse.controller.js";
import express from "express";
const router = express.Router();

router.get("/", SseController.CreateConnection as any);

export default router;
