import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { PROJECTS } from './src/data/projects.js';

const PAGES = ['/', '/services', '/portfolio', '/about', '/reviews', '/contact'];

/** Writes sitemap.xml and robots.txt into the build, using the public site URL. */
function seoFiles(siteUrl) {
  return {
    name: 'seo-files',
    apply: 'build',
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /'];
      if (siteUrl) {
        const urls = [...PAGES, ...PROJECTS.map((p) => `/portfolio/${p.slug}`)];
        const body = urls.map((u) => `  <url><loc>${siteUrl}${u}</loc></url>`).join('\n');
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
        });
        robots.push('', `Sitemap: ${siteUrl}/sitemap.xml`);
      } else {
        this.warn('No VITE_SITE_URL set — skipping sitemap.xml.');
      }
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots.join('\n')}\n` });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // On Vercel, default to the production domain for canonical URLs and the sitemap.
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const siteUrl = (env.VITE_SITE_URL || (vercelUrl ? `https://${vercelUrl}` : '')).replace(/\/$/, '');
  if (siteUrl) process.env.VITE_SITE_URL = siteUrl;

  return {
    plugins: [react(), tailwindcss(), seoFiles(siteUrl)],
    server: { port: 5173 },
    build: {
      rollupOptions: {
        output: {
          manualChunks: { react: ['react', 'react-dom', 'react-router'] },
        },
      },
    },
  };
});
