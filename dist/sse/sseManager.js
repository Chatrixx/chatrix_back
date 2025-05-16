const clients = new Map();
export const addClient = (userId, res) => {
    if (!clients.has(userId)) {
        clients.set(userId, new Set());
    }
    clients.get(userId).add(res);
};
export const removeClient = (userId, res) => {
    if (clients.has(userId)) {
        clients.get(userId).delete(res);
        if (clients.get(userId).size === 0) {
            clients.delete(userId);
        }
    }
};
export const sendClientEvent = (eventType, userId, eventData) => {
    if (!clients.has(userId))
        return;
    for (const res of clients.get(userId)) {
        res.write(`data: ${JSON.stringify({
            eventType,
            ...eventData,
        })}\n\n`);
    }
};
