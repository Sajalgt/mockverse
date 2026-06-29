
```markdown
# MockVerse

> AI-powered synthetic test data generator and API load tester — describe your data in plain English, generate up to 500,000 realistic fake records, and stress-test any API endpoint in real time.

---

## What is MockVerse?

MockVerse solves a problem every backend developer faces: **you've built an API, but you have no realistic data to test it with.**

Instead of manually writing fake JSON or setting up complex seeding scripts, MockVerse lets you describe your data in plain English. The AI understands your intent, generates a structured schema, and immediately creates bulk fake records using that schema — then hammers your API with all of them concurrently while you watch live.

---

## Live Demo

> Start the backend and frontend locally (see Setup below), then open `http://localhost:5173`

![MockVerse Demo](./demo.png)

---

## Key Features

### AI-Powered Schema Extraction (Gemini API)
Type a plain-English description like *"I need 5000 users with name, email, Delhi address, and a late-night order time"* — MockVerse sends this to Google's Gemini 2.5 Flash model with a strict structured output prompt. Gemini extracts only the relevant field names and data types, returning a clean JSON schema. No hallucinations, no extra text — just the schema.

### Realistic Bulk Data Generation (Faker.js)
Gemini only runs once (for schema extraction). All actual data generation is handled locally using `@faker-js/faker` — a production-grade fake data library with 100+ generators. A custom field-type registry maps schema fields to the right Faker functions (`email → faker.internet.email()`, `night_time → custom time generator`, etc.), with partial-match fallback for unrecognized types. Zero API cost for data generation. Supports up to **500,000 records** per test run.

### Full HTTP Method Support
MockVerse supports all standard HTTP methods for load testing — not just POST. You can configure the test to hit your endpoint with:

| Method | Typical Use Case |
|---|---|
| `GET` | Fetch/read endpoints, search APIs |
| `POST` | Create resource endpoints |
| `PUT` | Full update/replace endpoints |
| `PATCH` | Partial update endpoints |
| `DELETE` | Delete resource endpoints |

Each request is sent with the generated fake record as the body (where applicable), and response metrics are tracked per method.

### Concurrent Load Testing with Batching
Generated records are sent to your target API endpoint as concurrent HTTP requests. Requests are processed in configurable batches (1–500 concurrent requests per batch, user-controlled) using `Promise.all()`. This simulates real-world traffic patterns — not a simple sequential loop — and lets you find exactly where your API starts to crack under pressure.

### Real-Time Live Progress (Socket.io)
As the load test runs, a WebSocket connection (Socket.io) streams live progress updates to the frontend: requests sent, success count, failure count, and completion percentage — all updating in real time without polling. The progress bar and counters animate as each batch completes.

### Detailed Results Dashboard (Recharts)
When the test completes, a full results dashboard renders instantly:
- **Pass/Fail Pie Chart** — visual success vs failure ratio with percentage
- **Response Time Metrics** — Avg, Min, Max, and P95 response times in milliseconds
- **Error Breakdown** — failed requests categorized by error type (HTTP 404, HTTP 500, connection refused, etc.) with a mini progress bar showing proportion of each error

### Configurable Concurrency Control
Unlike most demo load-testing tools that use a fixed batch size, MockVerse exposes concurrency as a user-controlled parameter (1–500). This mirrors how real tools like k6 and JMeter work — you decide how aggressive the test is. Lower concurrency = gradual ramp-up test. Higher concurrency = spike/stress test.

### Mock Mode for Safe Development
A `USE_MOCK_GEMINI` flag in `.env` lets you run the entire app without consuming real Gemini API quota. When enabled, a predefined schema is returned instantly — useful for UI development, demos, and CI environments where real AI calls aren't needed.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and dev server |
| Tailwind CSS v3 | Utility-first styling |
| Recharts | Pass/fail pie chart and results visualization |
| Socket.io Client | Real-time WebSocket connection for live progress |
| Axios / Fetch API | HTTP calls to backend endpoints |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server and routing |
| Socket.io | WebSocket server for live progress emission |
| @faker-js/faker | Realistic fake data generation (names, emails, addresses, etc.) |
| Google Gemini 2.5 Flash API | Natural language → JSON schema extraction (1 API call per test) |
| dotenv | Environment variable management |
| CORS | Cross-origin request handling between frontend and backend |

### Architecture Pattern
- **No database** — stateless by design; each test run is fully self-contained in memory
- **Controller-Service pattern** — routes → controllers → services (clean separation of concerns)
- **Event-driven progress** — Socket.io events (`test-progress`, `test-complete`, `test-error`) decouple the load test execution from the HTTP response cycle

---

## How It Works

```
User Input (plain English)
        ↓
  Gemini API (1 call)
  Extracts field names + types → JSON Schema
        ↓
  Faker.js (local, free)
  Generates up to 500k fake records from schema
        ↓
  Load Test Engine
  Sends records as concurrent HTTP requests (GET/POST/PUT/PATCH/DELETE)
  Tracks success/fail/response times per request
        ↓
  Socket.io
  Streams live progress to frontend in real time
        ↓
  Results Dashboard
  Pie chart + metrics + error breakdown
```

**Key design decision:** Gemini is intentionally used for schema extraction only (1 API call = near-zero cost), never for data generation. All bulk generation happens locally using Faker.js — this keeps the tool fast, free, and scalable.

---

## Setup & Installation

### Option A — Run Locally

#### Prerequisites
- Node.js v20+
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

#### 1. Clone the repository
```bash
git clone https://github.com/Sajalgt/mockverse.git
cd mockverse
```

#### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
# Add your Gemini API key to .env
```

#### 3. Configure `.env`
```env
GEMINI_API_KEY=your_gemini_api_key_here
USE_MOCK_GEMINI=true   # set to false to enable real Gemini responses
PORT=5000
```

#### 4. Frontend setup
```bash
cd ../frontend
npm install
```

#### 5. Run the app

**Terminal 1 — Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

### Option B — Run with Docker

#### Prerequisites
- Docker and Docker Compose installed
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

#### 1. Clone the repository
```bash
git clone https://github.com/Sajalgt/mockverse.git
cd mockverse
```

#### 2. Configure environment variables
```bash
cd backend
cp .env.example .env
# Add your Gemini API key to .env
```

#### 3. Build and start containers
```bash
# From the project root
docker-compose up --build
```

Open `http://localhost:5173` in your browser.

#### Notes on Docker networking
- The backend runs on `node:20-alpine` inside a container
- Frontend calls to the backend must use `host.docker.internal` instead of `localhost` when running both services in separate containers — this is already handled in the Docker Compose config
- Avoid port `6000` — some browsers (notably Firefox) block it; the backend is configured on port `5000` and the frontend dev server on `5173`
- Node.js v20 is required inside the container — `faker v10+` and `Vite v8+` are incompatible with Node 18

#### Docker Compose overview
```yaml
services:
  backend:
    build: ./backend      # node:20-alpine
    ports: ["5000:5000"]
    env_file: ./backend/.env

  frontend:
    build: ./frontend
    ports: ["5173:5173"]
    depends_on: [backend]
```

---

## Project Structure

```
mockverse/
├── backend/
│   ├── controllers/
│   │   ├── schemaController.js   # Handles /api/generate-schema
│   │   └── testController.js     # Handles /api/run-test
│   ├── routes/
│   │   └── testRoutes.js         # Express route definitions
│   ├── services/
│   │   ├── geminiService.js      # Gemini API integration + mock mode
│   │   ├── dataGenerator.js      # Schema → bulk Faker data
│   │   └── loadTester.js         # Concurrent request engine + metrics
│   ├── socket/
│   │   └── socketHandler.js      # Socket.io connection management
│   ├── utils/
│   │   └── fieldMapper.js        # Field type → Faker function registry
│   └── server.js                 # Express + Socket.io server entry point
│
└── frontend/
    └── src/
        ├── components/
        │   ├── SchemaInput.jsx       # Natural language input
        │   ├── SchemaPreview.jsx     # Generated schema display
        │   ├── TargetApiForm.jsx     # URL + HTTP method + concurrency config
        │   ├── LiveProgress.jsx      # Real-time progress bar + counters
        │   ├── ResultsChart.jsx      # Pie chart + response time metrics
        │   └── ErrorBreakdown.jsx    # Error type categorization
        ├── hooks/
        │   └── useSocket.js          # Socket.io React hook
        └── services/
            └── api.js                # Backend API calls
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/generate-schema` | Accepts `{ userInput }`, returns JSON schema |
| POST | `/api/run-test` | Accepts `{ schema, targetUrl, httpMethod, batchSize }`, runs load test |

The `httpMethod` field in `/api/run-test` accepts: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.

---

## Known Gotchas

| Issue | Fix |
|---|---|
| Firefox blocks port 6000 | Use port 5000 for backend (already default) |
| Node 18 breaks faker v10+ / Vite v8 | Use Node 20+ (enforced in Docker via `node:20-alpine`) |
| Docker backend can't reach localhost | Use `host.docker.internal` in Docker Compose networking |
| Gemini API rate limit (20 RPD free tier) | Enable `USE_MOCK_GEMINI=true` for development |

---

## License

MIT © 2026 [Sajal](https://github.com/Sajalgt)
```
