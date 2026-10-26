import { env } from '../config/env.js';
import { Project } from '../models/Project.js';

const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/portfolio', priority: '0.9', changefreq: 'weekly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/reviews', priority: '0.7', changefreq: 'weekly' },
  { path: '/contact', priority: '0.8', changefreq: 'yearly' },
];

const escapeXml = (s) =>
  String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);

export async function buildSitemap() {
  const projects = await Project.find({ published: true }).select('slug updatedAt').lean();
  const urls = [
    ...STATIC_PAGES.map((p) => ({ loc: `${env.siteUrl}${p.path}`, ...p })),
    ...projects.map((p) => ({
      loc: `${env.siteUrl}/portfolio/${p.slug}`,
      lastmod: p.updatedAt?.toISOString().slice(0, 10),
      changefreq: 'yearly',
      priority: '0.6',
    })),
  ];

  const body = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${escapeXml(u.loc)}</loc>\n` +
        (u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : '') +
        `    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function buildRobots() {
  return ['User-agent: *', 'Allow: /', 'Disallow: /admin', 'Disallow: /api/', '', `Sitemap: ${env.siteUrl}/sitemap.xml`, ''].join('\n');
}
