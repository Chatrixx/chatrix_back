// controllers/sse.controller.ts

import { Request, Response } from "express";
import { addClient, removeClient } from "#sse/sseManager.js";
import { RequestWithAnyQuery } from "#types/request";

interface SSEQuery {
  id: string; // ?id=... şeklinde alınacak
}

const CreateConnection = (req: RequestWithAnyQuery, res: Response) => {
  const userId = req.query.id;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "Missing user ID in query",
    });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  // ✅ İlk veri (chunk başlatmak için zorunlu)
  res.write(`data: ${JSON.stringify({ msg: "connected" })}\n\n`);

  // ✅ 25 saniyede bir boş ping (yorum satırı)
  const keepAlive = setInterval(() => {
    res.write(":\n\n"); // tarayıcı bağlantıyı açık tutar
  }, 25000);

  // ✅ Client'ı kaydet
  addClient(userId, res);

  // ✅ Temizlik
  req.on("close", () => {
    removeClient(userId, res);
    clearInterval(keepAlive);
    res.end();
    console.log("SSE disconnected:", userId);
  });
};

const SseController = {
  CreateConnection,
};

export default SseController;
