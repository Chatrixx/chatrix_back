import ChatsService from "../services/chats/index.js";
import { catchAsync } from "../utils/api/catchAsync.js";

const GetAllChats = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  res.json(
    await ChatsService.getAll({
      clinic_id: userId,
      channel: req.query.channel,
    })
  );
});

const GetUserChatsByChannel = catchAsync(async (req, res) => {
  const user = await ChatsService.getByUser({
    user_id: req.user?.userId,
    channel: req.params.channel,
  });
  if (user.clinic_id !== req.user?.userId) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  res.json(user);
});

const ChatsController = {
  GetAllChats,
  GetUserChatsByChannel,
};

export default ChatsController;
