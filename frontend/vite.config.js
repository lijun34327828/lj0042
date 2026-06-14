import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3762,
    proxy: {
      '/api': {
        target: 'http://localhost:8762',
        changeOrigin: true
      }
    }
  }
})
