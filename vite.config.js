import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import backend from './server.mjs'

const backendPlugin = {
  name: 'express-backend',
  configureServer(server) {
    server.middlewares.use(backend)
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), backendPlugin],
  server: {
    port: 5173,
    strictPort: true,
  },
})
