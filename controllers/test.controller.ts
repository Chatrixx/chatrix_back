import TestService from "#services/test/index.js";
import { AuthenticatedRequest } from "#types/request.js";
import { catchAsync } from "#utils/api/catchAsync.js";
import { Response } from "express";
const SendMessage = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    await TestService.sendMessage(req.body.input, req.auth.user.id);
    res
      .status(200)
      .json({ message: "Message is taken, will be handled soon." });
  }
);

const GetAllMessages = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const data = await TestService.getAllMessages(req.auth.user.id);
    res.status(200).json(data);
  }
);

const ClearChatContext = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const data = await TestService.clearChatContext(req.auth.user.id);
    res.status(200).json(data);
  }
);

const TestController = {
  SendMessage,
  GetAllMessages,
  ClearChatContext,
};

export default TestController;
