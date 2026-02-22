# MindMate — Backend

This folder documents the **backend** of MindMate.

> **Note:** The actual backend source lives in root-level `api/` (Vercel Serverless Functions)
> and `server.js` (local Express server). Vercel requires `api/` to be at the project root.

## 📁 Backend Structure

```
root/
├── api/                  # Vercel Serverless Functions (deployed to production)
│   ├── chat.js           # POST /api/chat — AI chat via Groq
│   ├── symptoms.js       # POST /api/symptoms — Symptom checker
│   ├── moods.js          # GET/POST /api/moods — Mood tracking
│   ├── journals.js       # GET/POST /api/journals — Journal entries
│   └── health.js         # GET /api/health — Health check
│
└── server.js             # Local Express server (development only)
```

## 🚀 Running Locally

From the **root** of the project:

```bash
npm install
npm run server     # Start Express backend on port 3000
```

Or run both frontend + backend simultaneously:

```bash
npm run dev:local  # Starts both server.js and Vite dev server
```

## 🌐 Environment Variables

Create a `.env` file in the project root (never commit this file!):

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3000
```

Get your free Groq API key at: https://console.groq.com

## 📡 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/health` | Server health check |
| `POST` | `/chat` | AI mental health chat |
| `POST` | `/symptoms` | Symptom analysis |
| `GET/POST` | `/api/moods` | Mood tracking |
| `GET/POST` | `/api/journals` | Journal entries |

## 🚢 Deployment

The `api/` functions deploy automatically to Vercel as Serverless Functions.
Set the following environment variables in your Vercel project dashboard:

- `GROQ_API_KEY` — Your Groq API key
