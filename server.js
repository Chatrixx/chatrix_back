import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import sendMessageRoutes from "./routes/agent/send_message.js";
import fetchUserRoutes from "./routes/auth/fetch_first_user.js";
import getChatsRoutes from "./routes/dashboard/chats/get-recent-chats.js";
import createClinicRoutes from "./routes/dashboard/clinic/create.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use("/api/agent/send_message", sendMessageRoutes);
app.use("/api/auth/fetch_first_user", fetchUserRoutes);
app.use("/api/dashboard/get-recent-chats", getChatsRoutes);
app.use("/api/clinic/create", createClinicRoutes);

app.listen(PORT, () => console.log(`🚀 Express running on port ${PORT}`));
