# DevCollab Collaboration Server

This server provides the real-time collaboration backend for DevCollab. It hosts:
- a WebSocket endpoint for collaborative document sessions
- an HTTP endpoint for telemetry ingestion

## File structure

```
server/
  src/
    index.ts           # Server entry point (WebSocket + telemetry routes)
  data/
    telemetry.jsonl    # Append-only telemetry event log
  package.json         # Build/start scripts and dependencies
  tsconfig.json        # TypeScript compiler configuration
```

## Build instructions

### Requirements

- Node.js 20 LTS or newer
- Yarn (recommended via Corepack)
- Network access to expose/listen on TCP port `1234` (or your reverse-proxy mapped port)

### Build steps

1. Open a terminal in `server/`.
2. Enable Corepack (one-time per machine):

```bash
corepack enable
```

3. Install dependencies:

```bash
yarn install
```

4. Compile TypeScript:

```bash
yarn build
```

### Deploy steps

1. Build production output:

```bash
yarn build
```

2. Start the server:

```bash
yarn start
```

The server listens on `http://127.0.0.1:1234` and serves:
- WebSocket endpoint: `/`
- Telemetry endpoint: `POST /telemetry/session`

For production deployment, run behind a reverse proxy (for TLS termination) and route both HTTP and WebSocket traffic to the Node process.
