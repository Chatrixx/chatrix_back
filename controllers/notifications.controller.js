import NotificationsService from "../services/notifications/index.js";
import { catchAsync } from "../utils/api/catchAsync.js";

const GetAllNotifications = catchAsync(async (req, res) => {
  const notifications = await NotificationsService.getAll({
    clinic_id: req.user?.userId,
  });
  res.json(notifications);
});

const GetNotificationById = async (req, res) => {
  const notification = await NotificationsService.getById({
    notification_id: req.params?.notification_id,
  });
  if (notification.clinic_id !== req.user?.userId) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  res.json(notification);
};

const MarkAllSeen = catchAsync(async (req, res) => {
  res.json(
    await NotificationsService.markSeenAll({
      clinic_id: req.params?.notification_id,
    })
  );
});

const MarkSeenById = catchAsync(async (req, res) => {
  const notification = await NotificationsService.getById({
    notification_id: req.params?.notification_id,
  });
  if (notification.clinic_id !== req.user?.userId) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  res.json(
    await NotificationsService.markSeenById({
      notification_id: req.params?.notification_id,
    })
  );
});

const NotificationsController = {
  GetAllNotifications,
  GetNotificationById,
  MarkAllSeen,
  MarkSeenById,
};

export default NotificationsController;
