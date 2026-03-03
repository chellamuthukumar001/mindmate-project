import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: false,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-icon.svg'],
      manifest: {
        name: 'MindMate – AI Mental Health Companion',
        short_name: 'MindMate',
        description: 'Your personal AI mental health companion for mood tracking, guided breathing, focus sessions, and confidential support.',
        theme_color: '#7C3AED',
        background_color: '#1a0533',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/app',
        id: '/app',
        lang: 'en',
        categories: ['health', 'lifestyle', 'medical'],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Chat with AI',
            short_name: 'Chat',
            description: 'Talk to your MindMate AI companion',
            url: '/app/chat',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }],
          },
          {
            name: 'Log Mood',
            short_name: 'Mood',
            description: 'Track how you feel today',
            url: '/app/mood',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }],
          },
          {
            name: 'Breathing Exercise',
            short_name: 'Breathe',
            description: 'Start a guided breathing session',
            url: '/app/breathing',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }],
          },
          {
            name: 'Focus Mode',
            short_name: 'Focus',
            description: 'Start a focused deep work session',
            url: '/app/focus',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }],
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/chat': 'http://localhost:3000',
      '/symptoms': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
      '/api': 'http://localhost:3000',
    },
  },
})
