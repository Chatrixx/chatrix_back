import express from "express";
import NotificationsController from "../controllers/notifications.controller.js";
const router = express.Router();

router.get("/", NotificationsController.GetAllNotifications);
router.get("/:id", NotificationsController.GetNotificationById);
router.patch("/see/all", NotificationsController.MarkAllSeen);
router.patch("/see/:id", NotificationsController.MarkSeenById);

export default router;
