import NotificationsService from "../services/notifications/index.js";

async function GetAllNotifications(req, res, next) {
  try {
    res.json(
      await NotificationsService.getAll({ clinic_id: req.user?.userId })
    );
  } catch (error) {
    next(error);
  }
}

async function GetNotificationById(req, res, next) {
  try {
    const notification = await NotificationsService.getById({
      notification_id: req.params?.notification_id,
    });
    if (notification.clinic_id !== req.user?.userId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    res.json(notification);
  } catch (error) {
    next(error);
  }
}

async function MarkAllSeen(req, res, next) {
  try {
    res.json(
      await NotificationsService.markSeenAll({
        clinic_id: req.params?.notification_id,
      })
    );
  } catch (error) {
    next(error);
  }
}

async function MarkSeenById(req, res, next) {
  try {
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
  } catch (error) {
    next(error);
  }
}

const NotificationsController = {
  GetAllNotifications,
  GetNotificationById,
  MarkAllSeen,
  MarkSeenById,
};

export default NotificationsController;
