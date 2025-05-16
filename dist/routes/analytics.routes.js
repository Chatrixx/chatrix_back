import express from "express";
import AnalyticsController from "#controllers/analytics.controller.js";
const router = express.Router();
router.get("/", AnalyticsController.GetAnalytics);
export default router;
