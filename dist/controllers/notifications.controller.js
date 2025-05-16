import NotificationsService from "#services/notifications/index.js";
import { catchAsync } from "#utils/api/catchAsync.js";
const GetAllNotifications = catchAsync(async (req, res) => {
    const notifications = await NotificationsService.getAll({
        clinic_id: req.auth.user.id,
    });
    res.json(notifications);
});
const GetNotificationById = catchAsync(async (req, res) => {
    const notification = await NotificationsService.getById({
        notification_id: req.params.notification_id,
    });
    if (String(notification.clinic_id) !== req.auth.user.id) {
        res.status(403).json({ message: "Forbidden" });
        return;
    }
    res.json(notification);
});
const MarkAllSeen = catchAsync(async (req, res) => {
    res.json(await NotificationsService.markAllSeen({
        clinic_id: req.params.notification_id,
    }));
});
const MarkSeenById = catchAsync(async (req, res) => {
    const notification = await NotificationsService.getById({
        notification_id: req.params.notification_id,
    });
    if (String(notification.clinic_id) != req.auth.user.id) {
        res.status(403).json({ message: "Forbidden" });
        return;
    }
    res.json(await NotificationsService.markSeenById({
        notification_id: req.params.notification_id,
    }));
});
const NotificationsController = {
    GetAllNotifications,
    GetNotificationById,
    MarkAllSeen,
    MarkSeenById,
};
export default NotificationsController;
