# MockVerse

> AI-powered synthetic test data generator and API load tester

Describe your data in plain English, generate up to 500k realistic fake records, and stress-test any API endpoint in real time — with live progress and a full results dashboard.

![MockVerse Demo](./demo.png)

---

## Features

- 🧠 **AI Schema Extraction** — plain English → structured JSON schema via Gemini 2.5 Flash (1 API call per run)
- 📦 **Bulk Data Generation** — up to 500,000 fake records generated locally with Faker.js (zero API cost)
- ⚡ **Concurrent Load Testing** — configurable batch sizes (1–500), supports GET / POST / PUT / PATCH / DELETE
- 📡 **Real-Time Progress** — live success/fail counters streamed via Socket.io WebSocket
- 📊 **Results Dashboard** — pass/fail pie chart, avg/min/max/P95 response times, error breakdown by type
- 🔧 **Mock Mode** — `USE_MOCK_GEMINI=true` skips real API calls for local dev and demos

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v3, Recharts, Socket.io Client |
| Backend | Node.js, Express, Socket.io, Faker.js, Gemini 2.5 Flash API |
| DevOps | Docker, Docker Compose (node:20-alpine) |

---

## Architecture
User Input (plain English)

↓

Gemini API — extracts field names + types → JSON Schema  [1 call]

↓

Faker.js — generates up to 500k fake records locally     [free]

↓

Load Test Engine — fires concurrent HTTP requests        [GET/POST/PUT/PATCH/DELETE]

↓

Socket.io — streams live progress to frontend

↓

Results Dashboard — charts + metrics + error breakdown

> Gemini handles schema extraction only. All data generation runs locally via Faker.js — keeping it fast, free, and scalable.

---

## Project Structure
mockverse/

├── backend/

│   ├── controllers/       # route handlers

│   ├── services/          # geminiService, dataGenerator, loadTester

│   ├── socket/            # Socket.io connection + event emission

│   ├── utils/             # fieldMapper (field type → Faker function registry)

│   └── server.js

│

└── frontend/

└── src/

├── components/    # SchemaInput, LiveProgress, ResultsChart, ErrorBreakdown

├── hooks/         # useSocket.js

└── services/      # api.js

---

## Setup

### Run Locally

**Prerequisites:** Node.js v20+, Gemini API key ([get one free](https://aistudio.google.com/apikey))

```bash
git clone https://github.com/Sajalgt/mockverse.git

# Backend
cd backend
npm install
cp .env.example .env      # paste your Gemini API key here
node server.js

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

### Run with Docker

```bash
git clone https://github.com/Sajalgt/mockverse.git
cd backend && cp .env.example .env    # add Gemini API key
docker-compose up --build
```

Open `http://localhost:5173`

---

## API Reference

| Method | Endpoint | Payload | Description |
|---|---|---|---|
| POST | `/api/generate-schema` | `{ userInput }` | Natural language → JSON schema |
| POST | `/api/run-test` | `{ schema, targetUrl, httpMethod, batchSize }` | Run load test |

`httpMethod` accepts: `GET` `POST` `PUT` `PATCH` `DELETE`

---

## Known Gotchas

| Issue | Fix |
|---|---|
| Firefox blocks port 6000 | Backend runs on port 5000 by default |
| Node 18 breaks Faker v10+ / Vite v8 | Use Node 20+ (Docker enforces this via `node:20-alpine`) |
| Docker can't reach localhost | Use `host.docker.internal` — already handled in Compose config |
| Gemini free tier (20 RPD limit) | Set `USE_MOCK_GEMINI=true` for development |

---

## License

MIT © 2026 [Sajal](https://github.com/Sajalgt)