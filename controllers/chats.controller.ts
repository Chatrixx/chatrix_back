import Client from "#db/models/Client.js";
import ChatsService from "#services/chats/index.js";
import { AuthenticatedRequest } from "#types/request.js";
import ApiError from "#utils/api/ApiError.js";
import { catchAsync } from "#utils/api/catchAsync.js";
import { Response } from "express";

const GetAllChats = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.auth.user.id;
    res.json(
      await ChatsService.getAll({
        clinic_id: userId,
        channel: req.query.channel,
      })
    );
  }
);

const GetUserChatsByChannel = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const client = await Client.findById(req.params.client_id).orFail(() => {
      throw new ApiError(400, "No such client");
    });
    if (String(client.clinic_id) != req.auth.user.id) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    const clientChannel = await ChatsService.getByClient({
      client_id: req.params.client_id,
      channel: req.query.channel,
    });

    res.json(clientChannel);
  }
);

const ChatsController = {
  GetAllChats,
  GetUserChatsByChannel,
};

export default ChatsController;
