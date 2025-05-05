import NotificationsController from "#controllers/notifications.controller.js";
import express from "express";
const router = express.Router();

router.get("/", NotificationsController.GetAllNotifications);

router.get("/:id", NotificationsController.GetNotificationById);
router.patch("/see/all", NotificationsController.MarkAllSeen);
router.patch("/see/:id", NotificationsController.MarkSeenById);

export default router;
