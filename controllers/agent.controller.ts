import { Request, Response } from "express";
import { catchAsync } from "#utils/api/catchAsync.js";
import AgentService from "#services/agent/index.js";

const SendMessage = catchAsync(async (req: Request, res: Response) => {
  await AgentService.sendMessage(req.body, req.body.clinic_id);
  res.status(200).json({ message: "Message is taken, will be handled soon." });
});

const GetFreshMessages = catchAsync(async (req: Request, res: Response) => {
  const data = await AgentService.getFreshMessages(
    req.body,
    req.body.clinic_id
  );
  res.status(200).json(data);
});

const AgentController = {
  SendMessage,
  GetFreshMessages,
};

export default AgentController;
