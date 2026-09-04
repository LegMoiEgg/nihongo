import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/messaging'],
        },
      },
    },
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'NihonGo - Japanisch Lernen',
        short_name: 'NihonGo',
        description: 'Lerne Japanisch mit Hiragana, Katakana, Kanji und Vokabeln',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,svg,png,woff2}'],
        // Never let the Workbox SW precache or serve the FCM service worker —
        // it must be fetched fresh so push handling isn't broken by a stale
        // cached copy. This prevents the "notifications work only for the app
        // creator / stop working after a deploy" class of PWA+FCM conflicts.
        globIgnores: ['**/firebase-messaging-sw.js'],
        navigateFallbackDenylist: [/firebase-messaging-sw\.js$/],
        // Take control immediately when a new version is deployed, so users
        // get the latest code without needing to close all tabs first.
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
})
