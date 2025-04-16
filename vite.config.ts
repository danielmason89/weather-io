import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/weather': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    },
  },
});