import express from "express";
import SseController from "../controllers/sse.controller.js";
const router = express.Router();

router.get("/sse", SseController.CreateConnection);

export default router;
