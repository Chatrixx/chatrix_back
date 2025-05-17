import { ISseEventType } from "#constants/sseEventTypes.js";

const clients = new Map();

export const addClient = (userId: string, res: any) => {
  if (!clients.has(userId)) {
    clients.set(userId, new Set());
  }
  clients.get(userId).add(res);

  // Opsiyonel: addClient içinden de başlangıç verisi göndermek istersen:
  res.write(
    `data: ${JSON.stringify({ eventType: "INIT", msg: "connected" })}\n\n`
  );
};


export const removeClient = (userId: string, res: any) => {
  if (clients.has(userId)) {
    clients.get(userId).delete(res);

    if (clients.get(userId).size === 0) {
      clients.delete(userId);
    }
  }
};

export const sendClientEvent = (
  eventType: ISseEventType,
  userId: string,
  eventData: any
) => {
  if (!clients.has(userId)) return;

  for (const res of clients.get(userId)) {
    res.write(
      `data: ${JSON.stringify({
        eventType,
        ...eventData,
      })}\n\n`
    );
  }
};
