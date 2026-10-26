import fs from 'node:fs';
import path from 'node:path';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiters.js';
import { sanitizeBody } from './middleware/sanitize.js';
import apiRoutes from './routes/index.js';
import { buildRobots, buildSitemap } from './services/seo.js';

const clientDist = path.resolve(import.meta.dirname, '../../frontend/dist');

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  if (env.TRUST_PROXY) app.set('trust proxy', /^\d+$/.test(env.TRUST_PROXY) ? Number(env.TRUST_PROXY) : env.TRUST_PROXY);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"], // JSON-LD structured data is injected inline
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'blob:', 'https://images.unsplash.com', 'https://*.googleusercontent.com', 'https://*.ggpht.com'],
          frameSrc: ['https://www.google.com', 'https://maps.google.com'],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
        },
      },
      // Lets a separately-hosted frontend load /uploads images.
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(compression());
  app.use(
    cors({
      origin(origin, cb) {
        if (!origin || env.clientOrigins.includes(origin)) return cb(null, true);
        return cb(new Error(`Not allowed by CORS: ${origin}`));
      },
      credentials: true,
      allowedHeaders: ['Content-Type', 'X-Requested-With', 'Accept'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      maxAge: 600,
    }),
  );
  if (!env.isTest) app.use(morgan(env.isProduction ? 'combined' : 'dev'));
  app.use(express.json({ limit: '200kb' }));
  app.use(cookieParser());
  app.use(sanitizeBody);

  app.use(
    '/uploads',
    express.static(env.uploadDir, { maxAge: '30d', immutable: true, index: false, dotfiles: 'deny', fallthrough: false }),
  );

  app.get('/sitemap.xml', async (_req, res) => {
    res.type('application/xml').set('Cache-Control', 'public, max-age=3600').send(await buildSitemap());
  });
  app.get('/robots.txt', (_req, res) => res.type('text/plain').send(buildRobots()));

  app.use('/api', apiLimiter, apiRoutes);

  // Optionally serve the built React app from the same origin.
  if (env.SERVE_CLIENT && fs.existsSync(clientDist)) {
    app.use(express.static(clientDist, { index: false, maxAge: '1h' }));
    app.use('/assets', express.static(path.join(clientDist, 'assets'), { immutable: true, maxAge: '1y' }));
    app.get('/{*splat}', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
  }

  app.use(errorHandler);
  return app;
}
