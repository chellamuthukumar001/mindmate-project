# 🚀 MindMate — Deployment Guide

This guide walks you through pushing MindMate to GitHub and deploying it live on Vercel.

---

## 📋 Architecture Overview

```
MindMate (Single Repo on Vercel)
│
├── Frontend  →  React + Vite  (served by Vercel CDN)
│                src/  index.html  vite.config.js
│
└── Backend   →  Vercel Serverless Functions  (auto-deployed)
                 api/chat.js
                 api/moods.js
                 api/journals.js
                 api/symptoms.js
                 api/health.js
```

> No separate backend hosting needed — Vercel handles both frontend and API!

---

## STEP 1 — Push to GitHub

### 1.1 Make sure your .env is NOT committed
```bash
# Verify .env is ignored (should show nothing)
git ls-files | Select-String ".env$"
```

### 1.2 Stage and push your code
```bash
git add .
git commit -m "feat: ready for deployment"
git push origin main
```

If you get a GitHub file size error, check for large files:
```bash
# Find files over 50MB
git ls-files | ForEach-Object { $s = (Get-Item $_).Length; if($s -gt 50MB){echo "$_ = $s bytes"} }
```

> ✅ Your `.gitignore` already blocks `node_modules/`, `dist/`, `.env`, and `*.zip` files.

---

## STEP 2 — Get Your Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up / log in (free account)
3. Click **API Keys** → **Create API Key**
4. Copy the key — you'll need it in Step 4

---

## STEP 3 — Deploy on Vercel

### 3.1 Sign up / Log in to Vercel
Go to [https://vercel.com](https://vercel.com) and sign in with your **GitHub** account.

### 3.2 Import your repository
1. Click **"Add New Project"**
2. Click **"Import"** next to your `Mindmate` repository
3. Vercel auto-detects it as a **Vite** project

### 3.3 Configure the project settings

On the import screen, set:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `.` (leave as default) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

> These should already be auto-filled from your `vercel.json`. ✅

---

## STEP 4 — Set Environment Variables on Vercel

In the Vercel **import screen** (or later in **Settings → Environment Variables**):

| Name | Value | Environments |
|------|-------|--------------|
| `GROQ_API_KEY` | `gsk_xxxxxxxxxxxxxxxxxxxx` | Production, Preview, Development |

> ⚠️ **Never put your real API key in code or `.env.example`** — only set it in the Vercel dashboard.

### 4.1 To add/update env vars after deployment:
1. Go to your project on [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **Settings** → **Environment Variables**
3. Click **Add New** → enter `GROQ_API_KEY` and your key
4. Click **Save** — then **Redeploy** for it to take effect

---

## STEP 5 — Deploy! 🎉

Click **"Deploy"** on Vercel.

Vercel will:
1. Clone your repo
2. Run `npm install`
3. Run `npm run build` → outputs to `dist/`
4. Serve `dist/` as the frontend
5. Serve `api/*.js` files as serverless functions

After ~1-2 minutes, you'll get a live URL like:
```
https://mindmate-yourname.vercel.app
```

---

## STEP 6 — Verify Deployment

Check these routes work on your live URL:

| Route | Expected Result |
|-------|----------------|
| `https://your-app.vercel.app/` | Landing page loads |
| `https://your-app.vercel.app/app` | Dashboard loads |
| `https://your-app.vercel.app/api/health` | `{"status":"ok"}` |
| `https://your-app.vercel.app/app/chat` | AI chat works |

---

## 🔁 Redeploying After Changes

Every time you push to `main`, Vercel **automatically redeploys**:

```bash
# Make your changes, then:
git add .
git commit -m "fix: your change description"
git push origin main
# Vercel picks it up automatically ✅
```

---

## 🐛 Troubleshooting

### ❌ Build fails on Vercel
```
Check: Vercel Build Logs → look for missing imports or syntax errors
Fix:   Run `npm run build` locally first to catch errors before pushing
```

### ❌ API routes return 404
```
Check: vercel.json rewrites are correct
Check: api/ files are at the ROOT of the repo (not inside src/ or backend/)
Fix:   api/ must be at: mindmate/api/chat.js (not mindmate/src/api/chat.js)
```

### ❌ AI chat not working (offline mode)
```
Check: GROQ_API_KEY is set in Vercel Environment Variables
Check: Redeploy after adding the env var
Fix:   Vercel Settings → Environment Variables → Add GROQ_API_KEY → Redeploy
```

### ❌ Push rejected — file too large
```
Fix: Check your .gitignore includes node_modules/ and *.zip
     Run: git rm -r --cached node_modules (if already tracked)
     Run: git rm --cached yourfile.zip
```

### ❌ White screen / React app not loading
```
Check: Browser console for errors (F12)
Check: vite.config.js build output is 'dist'
Check: vercel.json has the SPA rewrite: { "source": "/(.*)", "destination": "/index.html" }
```

---

## 🌐 Custom Domain (Optional)

1. Go to your project → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g. `mindmate.yourdomain.com`)
4. Follow DNS instructions from Vercel
5. Free SSL certificate is automatically provisioned ✅

---

## 📁 Files That Control Deployment

| File | Role |
|------|------|
| `vercel.json` | Vercel config: build settings + API rewrites |
| `vite.config.js` | Vite build config |
| `package.json` | Build scripts (`npm run build`) |
| `api/*.js` | Serverless backend functions |
| `.env` | Local secrets (⚠️ NEVER commit this) |
| `.env.example` | Template showing what env vars are needed |
| `.gitignore` | Blocks large/sensitive files from GitHub |

---

**Made with ❤️ — Good luck with your deployment!**
