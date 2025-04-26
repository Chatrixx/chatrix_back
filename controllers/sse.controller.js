import { addClient, removeClient } from "../sse/sseManager.js";

const CreateConnection = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  addClient(req.user.userId, res);

  req.on("close", () => {
    removeClient(req.user.userId, res);
  });
};

const SseController = {
  CreateConnection,
};

export default SseController;
