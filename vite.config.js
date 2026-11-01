import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import backend from './server.mjs'
import tailwindcss from '@tailwindcss/vite'

const backendPlugin = {
  name: 'express-backend',
  configureServer(server) {
    server.middlewares.use(backend)
  },
}

export default defineConfig({
  plugins: [react(), tailwindcss(), backendPlugin],
  server: {
    port: 5173,
    strictPort: true,
  },
})
