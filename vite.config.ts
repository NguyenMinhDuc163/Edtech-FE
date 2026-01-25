import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@services': path.resolve(__dirname, './src/services'),
      '@models': path.resolve(__dirname, './src/types'),
      '@mocks': path.resolve(__dirname, './src/mocks'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['edtech.nguyenduc.click'],

    proxy: {
      '^/azure-blob/.*': {
        target: 'https://edtechblob.blob.core.windows.net',
        changeOrigin: true,
        secure: true, 
        rewrite: (path) => path.replace(/^\/azure-blob/, ''), 
      },
    },
  },
})