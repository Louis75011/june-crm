import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    proxy: {
      // API Express backend
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      // Proxy landing pages en dev
      '/lp/lestraversees': {
        target: 'http://localhost:5174',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lp\/lestraversees/, '')
      },
      '/lp/immobilier-neuf': {
        target: 'http://localhost:5175',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lp\/immobilier-neuf/, '')
      }
    }
  }
})
