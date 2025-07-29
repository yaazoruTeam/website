import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    watch: {
      usePolling: true,
      interval: 500,
    },
    host: true,
    port: 3005,
  },
})
