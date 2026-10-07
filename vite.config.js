import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * In production the React build and the PHP API share one domain, so the app
 * calls /api directly. In development Vite proxies /api to a PHP server, which
 * keeps requests same-origin there too - that matters because the admin
 * session is a cookie.
 *
 * Point it at a local PHP server (default):
 *   php -S localhost:8000 -t .
 * or at the live site by setting VITE_API_PROXY in .env.local:
 *   VITE_API_PROXY=https://smagizh.com
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.VITE_API_PROXY || 'http://localhost:8000'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: false,
      proxy: {
        '/api': { target, changeOrigin: true, secure: false },
        '/uploads': { target, changeOrigin: true, secure: false },
      },
    },
  }
})
