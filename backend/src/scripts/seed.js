import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { connectDB, disconnectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { sampleProjects, sampleServices } from '../config/seedData.js';
import { AdminUser } from '../models/AdminUser.js';
import { Project } from '../models/Project.js';
import { Service } from '../models/Service.js';
import { Settings } from '../models/Settings.js';
import { logger } from '../utils/logger.js';

/**
 * Idempotent: creates settings, services and sample projects only where they
 * don't already exist (matched by slug). `reset` wipes services & projects first.
 */
export async function seedDatabase({ reset = false, withAdmin = false } = {}) {
  if (reset) {
    await Promise.all([Service.deleteMany({}), Project.deleteMany({})]);
    logger.info('Removed existing services and projects.');
  }

  await Settings.getSingleton();
  await Promise.all([Service.syncIndexes(), Project.syncIndexes()]);

  let services = 0;
  for (const s of sampleServices) {
    const r = await Service.updateOne({ slug: s.slug }, { $setOnInsert: s }, { upsert: true });
    services += r.upsertedCount;
  }
  let projects = 0;
  for (const p of sampleProjects) {
    const r = await Project.updateOne({ slug: p.slug }, { $setOnInsert: p }, { upsert: true });
    projects += r.upsertedCount;
  }
  logger.info(`Seed complete: ${services} services and ${projects} sample projects added.`);

  if (withAdmin && (await AdminUser.countDocuments()) === 0) {
    const email = env.ADMIN_EMAIL || 'admin@example.com';
    const generated = !env.ADMIN_PASSWORD;
    const password = env.ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url');
    await AdminUser.create({ name: 'Site Owner', email, role: 'admin', passwordHash: await AdminUser.hashPassword(password) });
    logger.info(`Admin account created: ${email}${generated ? ` / ${password}  (generated — set ADMIN_PASSWORD to choose)` : ''}`);
  }
}

// Run directly: `npm run seed` (add `-- --reset` to replace sample content).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (env.MONGODB_URI === 'memory') {
      logger.warn('MONGODB_URI=memory seeds automatically on server start; nothing to do.');
    } else {
      await connectDB(env.MONGODB_URI);
      await seedDatabase({ reset: process.argv.includes('--reset'), withAdmin: true });
    }
  } catch (err) {
    logger.error('Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
}
