import { addClient, removeClient } from "#sse/sseManager.js";
import { AuthenticatedRequest } from "#types/request.js";
import { catchAsync } from "#utils/api/catchAsync.js";
import { Response } from "express";

const CreateConnection = catchAsync(
  (req: AuthenticatedRequest, res: Response) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    addClient(req.auth.user.id, res);

    req.on("close", () => {
      removeClient(req.auth.user.id, res);
    });
  }
);

const SseController = {
  CreateConnection,
};

export default SseController;
