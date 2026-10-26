import { connectDB, disconnectDB } from './config/db.js';
import { env } from './config/env.js';
import { createApp } from './app.js';
import { seedDatabase } from './scripts/seed.js';
import { logger } from './utils/logger.js';

async function start() {
  const { inMemory } = await connectDB(env.MONGODB_URI);
  // The in-memory database starts empty every time, so fill it with sample content.
  if (inMemory) await seedDatabase({ withAdmin: true });

  const server = createApp().listen(env.PORT, () => {
    logger.info(`API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });

  const shutdown = (signal) => {
    logger.info(`${signal} received, shutting down…`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
