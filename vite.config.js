import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/genesis-case-readiness/',
  build: {
    rollupOptions: {
      output: { entryFileNames: 'assets/[name]-[hash]-p3.js' },
    },
  },
})
