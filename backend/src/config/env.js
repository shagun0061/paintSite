import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

// Load backend/.env when present. Real environment variables always win.
const envFile = path.resolve(import.meta.dirname, '../../.env');
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);

const bool = (fallback) =>
  z
    .enum(['true', 'false', '1', '0', ''])
    .optional()
    .transform((v) => (v === undefined || v === '' ? fallback : v === 'true' || v === '1'));

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  SITE_URL: z.string().url().default('http://localhost:5173'),
  COOKIE_SECURE: bool(false),
  TRUST_PROXY: z.string().optional(),
  UPLOAD_DIR: z.string().default('uploads'),
  MAX_UPLOAD_MB: z.coerce.number().positive().max(20).default(5),
  SERVE_CLIENT: bool(false),
  GOOGLE_PLACES_API_KEY: z.string().optional(),
  GOOGLE_PLACE_ID: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional().or(z.literal('')),
  ADMIN_PASSWORD: z.string().optional(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment configuration:');
  for (const issue of parsed.error.issues) console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  process.exit(1);
}

const raw = parsed.data;
const isProduction = raw.NODE_ENV === 'production';

if (isProduction && raw.MONGODB_URI === 'memory') {
  console.error('MONGODB_URI=memory is for local development only.');
  process.exit(1);
}

export const env = {
  ...raw,
  isProduction,
  isTest: raw.NODE_ENV === 'test',
  clientOrigins: raw.CLIENT_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean),
  siteUrl: raw.SITE_URL.replace(/\/$/, ''),
  cookieSecure: raw.COOKIE_SECURE || isProduction,
  uploadDir: path.resolve(import.meta.dirname, '../..', raw.UPLOAD_DIR),
  maxUploadBytes: Math.round(raw.MAX_UPLOAD_MB * 1024 * 1024),
  googlePlacesEnabled: Boolean(raw.GOOGLE_PLACES_API_KEY && raw.GOOGLE_PLACE_ID),
};
