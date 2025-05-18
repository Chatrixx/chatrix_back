import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./db/mongodb.js";
import notFoundHandler from "./middleware/notFound.middleware.js";
import errorHandler from "./middleware/error.middleware.js";
import auth from "./middleware/auth.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import agentRoutes from "./routes/agent.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import chatsRoutes from "./routes/chats.routes.js";
import notificationRoutes from "./routes/notifications.routes.js";
import clientRoutes from "./routes/client.routes.js";
import testRoutes from "./routes/test.routes.js";
import meRoutes from "./routes/me.routes.js";
import sseRoutes from "./routes/sse.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT ?? 8080;

dbConnect().then(() => console.log("Connected to DB ✅"));

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Welcome ✨");
});

app.use("/api/auth", authRoutes);

app.use("/api/agent", agentRoutes);

app.use("/api/clients", auth, clientRoutes);

app.use("/api/me", auth, meRoutes);

app.use("/api/analytics", auth, analyticsRoutes);

app.use("/api/chats", auth, chatsRoutes);

app.use("/api/notifications", auth, notificationRoutes);

app.use("/api/test", auth, testRoutes);

app.use("/api/sse", sseRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`🚀 Express running on port ${String(PORT)}`)
);
