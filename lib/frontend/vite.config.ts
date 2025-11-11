import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'replace-env-vars',
      transformIndexHtml: {
        order: 'pre',
        handler(html) {
          return html.replace(
            /\$\{VITE_GOOGLE_MAPS_API_KEY\}/g,
            process.env.VITE_GOOGLE_MAPS_API_KEY || ''
          )
        },
      },
    },
  ],
  resolve: {
    alias: {
      '@model': path.resolve(process.cwd(), 'model/src'),
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
