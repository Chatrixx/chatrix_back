import ChatsController from "#controllers/chats.controller.js";
import express from "express";
const router = express.Router();

router.get("/", ChatsController.GetAllChats);
router.get("/:client_id", ChatsController.GetUserChatsByChannel);

export default router;
