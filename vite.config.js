import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'MindMate',
        short_name: 'MindMate',
        description: 'Your AI Mental Health Companion',
        theme_color: '#8B5CF6',
        background_color: '#F3F4F6',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/chat': 'http://localhost:3000',
      '/symptoms': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
      '/api': 'http://localhost:3000'
    }
  }
})
