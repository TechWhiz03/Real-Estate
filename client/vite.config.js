import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,  // tells the proxy to ignore thes SSL certificate validation errors
      },
    },
  },

  plugins: [react()],
})
