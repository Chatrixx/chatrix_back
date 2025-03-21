import express from "express";
import { eventsHandler } from "../../utils/sse.js";

const router = express.Router();

router.get("/", eventsHandler);

export default router;
