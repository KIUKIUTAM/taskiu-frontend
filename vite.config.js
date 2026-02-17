import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/taskiu/',
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  server: {
    open: '/taskiu/',
    proxy: {
      '/taskiu/api': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/taskiu\/api/, '/api'),
      },
    },
  },
});
