import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@model': path.resolve(process.cwd(), 'lib/model/src'),
    },
  },
  server: {
    watch: {
      usePolling: true,
      interval: 500,
    },
    host: true,
    port: 3005,
  },
})
