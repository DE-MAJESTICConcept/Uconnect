import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
})
// vite.config.js
export default {
  build: {
    chunkSizeWarningLimit: 1600, // in KB (1.6 MB)
  },
};
