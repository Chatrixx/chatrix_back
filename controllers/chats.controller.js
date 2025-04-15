import ChatsService from "../services/chats/index.js";

async function GetAllChats(req, res, next) {
  try {
    const userId = req.user?.id;
    res.json(await ChatsService.getAll({ clinic_id: userId }));
  } catch (error) {
    next(error);
  }
}

async function GetUserChatsByChannel(req, res, next) {
  try {
    const user = await ChatsService.getByUser({
      user_id: req?.user?.id,
      channel: req.params.channel,
    });
    if (user.clinic_id !== req.user?._id) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
}

const ChatsController = {
  GetAllChats,
  GetUserChatsByChannel,
};

export default ChatsController;
