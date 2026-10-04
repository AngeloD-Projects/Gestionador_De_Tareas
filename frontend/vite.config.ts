/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    // En desarrollo, /api se reenvía al backend: el navegador no ve otro origen.
    proxy: {
      '/api': {
        target: 'http://localhost:5238',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Zona horaria fija: los tests de fechas dan lo mismo en cualquier PC o servidor (Perú = UTC-5).
    env: { TZ: 'America/Lima' },
  },
})
