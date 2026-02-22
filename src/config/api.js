// src/config/api.js
// Relative URLs work for both:
//   - Local dev:    Vite proxy (vite.config.js) forwards to localhost:3000
//   - Production:  Vercel serves api/*.js as Serverless Functions at /api/*
//                  and vercel.json rewrites /chat → /api/chat, /health → /api/health

export const API_ENDPOINTS = {
    chat: '/chat',              // → rewrites to /api/chat   (Vercel)
    health: '/health',          // → rewrites to /api/health (Vercel)
    symptoms: '/symptoms',      // → rewrites to /api/symptoms (Vercel)
    moods: '/api/moods',        // → served natively at /api/moods (Vercel)
    journals: '/api/journals',  // → served natively at /api/journals (Vercel)
};
