import { Logger } from "@hocuspocus/extension-logger";
import { Server } from "@hocuspocus/server";

const server = new Server({
  port: 1234,
  extensions: [new Logger()]
});

server.listen();