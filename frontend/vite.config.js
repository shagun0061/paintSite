import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_DEV_API_TARGET || 'http://localhost:5000';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      // In development the API, uploads, sitemap and robots are served by Express.
      proxy: Object.fromEntries(['/api', '/uploads', '/sitemap.xml', '/robots.txt'].map((p) => [p, apiTarget])),
    },
    preview: {
      proxy: Object.fromEntries(['/api', '/uploads', '/sitemap.xml', '/robots.txt'].map((p) => [p, apiTarget])),
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: { react: ['react', 'react-dom', 'react-router'] },
        },
      },
    },
  };
});
