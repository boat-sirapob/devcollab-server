import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

var clients = [];

wss.on("connection", ws => {
  clients.push(ws);

  ws.on("message", msg => {
    console.log("Received:", msg.toString());
    
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`${msg}`);
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
