import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirige peticiones que empiece con '/api'
      '/api': {
        target: 'http://localhost:4000', // URL backend
        changeOrigin: true,
      }
    }
  }
})