# MindMate — Frontend

This folder documents the **frontend** source code of MindMate.

> **Note:** The actual frontend source lives in the root-level `src/` directory.
> Vercel and Vite expect the project to be structured this way.

## 📁 Source Structure (`../src/`)

```
src/
├── components/       # Reusable UI components (Navigation, SymptomChecker, etc.)
├── pages/            # Page-level components (HomePage, ChatPage, MoodPage, etc.)
├── config/           # API endpoint configuration (api.js)
├── assets/           # Static assets (images, icons)
├── App.jsx           # Root app component with routing
├── App.css           # Global app styles
├── main.jsx          # React entry point
└── index.css         # Base global CSS
```

## 🚀 Running Locally

From the **root** of the project:

```bash
npm install
npm run dev        # Start frontend dev server (port 5173)
```

## 🔧 Key Config Files (Root Level)

| File | Purpose |
|------|---------|
| `vite.config.js` | Vite bundler config + dev proxy |
| `tailwind.config.js` | Tailwind CSS theme |
| `index.html` | HTML entry point |
| `.env.example` | Environment variable template |

## 🌐 Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (local: `http://localhost:3000`) |
