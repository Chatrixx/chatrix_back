import express from "express";
import NotificationsController from "../controllers/notifications.controller.js";
const router = express.Router();

router.get("/", NotificationsController.GetAllNotifications);
router.get("/:id", NotificationsController.GetNotificationById);
router.patch("/see/all", NotificationsController.MarkAllSeen);
router.patch("/see/:id", NotificationsController.MarkSeenById);

let clients = [];
function eventsHandler(req, res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  clients.push(res);

  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
  });
}

router.get("/sse", eventsHandler);

export default router;
