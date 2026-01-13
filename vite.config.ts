import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173
  },
  resolve: {
    alias: {
      '$src': path.resolve(__dirname, './src'),
    },
  },
  base: process.env.BASE_PATH || '/',
})
