import { Hocuspocus } from '@hocuspocus/server'
import { Logger } from "@hocuspocus/extension-logger";
import express from 'express'
import expressWebsockets from 'express-ws'
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const hocuspocus = new Hocuspocus({
  extensions: [new Logger()]
})

const { app } = expressWebsockets(express())

// JSON body parsing for telemetry routes
app.use(express.json())

// telemetry
const DATA_DIR = path.resolve(__dirname, '..', 'data')
const TELEMETRY_FILE = path.join(DATA_DIR, 'telemetry.jsonl')

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

interface SessionTelemetryEvent {
  eventType: string
  timestamp: string
  roomCode: string
  participantType: string
  username: string
  [key: string]: unknown
}

app.post("/telemetry/session", (req, res) => {
  const { eventType, timestamp, roomCode, participantType, username, ...extra } = req.body

  if (!eventType || !timestamp || !roomCode) {
    res.status(400).json({ error: "Missing required fields" })
    return
  }

  const event: SessionTelemetryEvent = {
    eventType,
    timestamp,
    roomCode,
    participantType: participantType ?? "",
    username: username ?? "",
    ...extra,
  }

  fs.appendFileSync(TELEMETRY_FILE, JSON.stringify(event) + '\n')
  console.log(`[telemetry] ${eventType} | room=${roomCode} user=${username} at ${timestamp}`)
  res.status(201).json({ ok: true })
})

app.ws("/", (websocket, request) => {
  hocuspocus.handleConnection(websocket, request);
})

app.listen(1234, () => console.log('Listening on http://127.0.0.1:1234'))
