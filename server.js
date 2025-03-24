import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sendMessageRoutes from "./routes/agent/send_message.js";
import getChatsRoutes from "./routes/dashboard/chats/get-recent-chats.js";
import createClinicRoutes from "./routes/dashboard/clinic/create.js";
import getFreshMessagesRoutes from "./routes/agent/get_fresh_messages.js";
import getAnalytics from "./routes/dashboard/analytics/get-analytics.js";
import sseRoute from "./routes/sse/sse.js";
import getNotifications from "./routes/dashboard/notifications/get-notifications.js";
import patchMarkAllSeen from "./routes/dashboard/notifications/patch-notifications-mark-all-seen.js";
import patchNotificationSeen from "./routes/dashboard/notifications/patch-notification-seen-by-id.js";
import postNotification from "./routes/dashboard/notifications/post-notification.js";
import getNotificationById from "./routes/dashboard/notifications/get-notification-by-id.js";


dotenv.config();

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use("/api/agent/send_message", sendMessageRoutes);
app.use("/api/dashboard/get-recent-chats", getChatsRoutes);
app.use("/api/clinic/create", createClinicRoutes);
app.use("/api/agent/get_fresh_messages", getFreshMessagesRoutes);
app.use("/api/dashboard/analytics", getAnalytics);
app.use("/api/sse", sseRoute);
app.use("/api/notification/get-notifications", getNotifications);
app.use("/dashboard/notifications", patchNotificationSeen);
app.use("/dashboard/notifications", patchMarkAllSeen);
app.use("/dashboard/notifications", postNotification);
app.use("/dashboard/notifications", getNotificationById);

app.listen(PORT, () => console.log(`🚀 Express running on port ${PORT}`));
