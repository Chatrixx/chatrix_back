import AgentService from "../services/agent/index.js";
import { catchAsync } from "../utils/api/catchAsync.js";

const SendMessage = catchAsync(async (req, res) => {
  const data = await AgentService.sendMessage(req.body, req.user?.userId);
  res.status(200).json(data);
});

const GetFreshMessages = catchAsync(async (req, res) => {
  const data = await AgentService.getFreshMessages(req.body, req.user?.userId);
  res.status(200).json(data);
});

const AgentController = {
  SendMessage,
  GetFreshMessages,
};

export default AgentController;
