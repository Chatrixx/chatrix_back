let clients = [];

function eventsHandler(req, res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // SSE başlığını hemen gönder

  clients.push(res);

  req.on("close", () => {
    clients = clients.filter(client => client !== res);
  });
}

function sendToClients(data) {
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

export { eventsHandler, sendToClients };
