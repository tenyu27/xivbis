import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { adminApi } from './tools/vite-plugin-admin-api'

/**
 * Local-only editor for public/data/sets.json — `yarn admin`.
 * Kept out of vite.config.ts so the normal dev server and the deployed build
 * never expose the write endpoint.
 */
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { target: '19' }]],
      },
    }),
    adminApi(),
  ],
  base: './',
  server: {
    port: 5174,
    // Set XIVBIS_NO_OPEN=1 to keep the server headless.
    open: process.env.XIVBIS_NO_OPEN ? false : '/admin.html',
    host: '127.0.0.1',
  },
})
