import { WebSocketServer } from "ws";

const PORT = 8080;

const wss = new WebSocketServer({ port: PORT });

console.log(`Started websocket server on port ${PORT}`)

var clients = [];

wss.on("connection", ws => {
  clients.push({
    ws: ws,
    id: clients.length,
  });

  ws.on("message", msg => {
    console.log("Received:", msg.toString());
    
    clients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(`${msg}`);
      }
    })
  });

  ws.on("close", () => {
    const index = clients.indexOf(ws);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });
});
