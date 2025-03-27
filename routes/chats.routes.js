import express from "express";
import ChatsController from "../controllers/chats.controller.js";
const router = express.Router();

router.get("/", ChatsController.GetAllChats);
router.get("/:user_id", ChatsController.GetUserChatsByChannel);

export default router;
