import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

/** Boots an isolated in-memory MongoDB and the Express app for a test file. */
export async function setupTestApp() {
  const mongo = await MongoMemoryServer.create();
  const uploadDir = await fs.mkdtemp(path.join(os.tmpdir(), 'paintsite-test-'));

  Object.assign(process.env, {
    NODE_ENV: 'test',
    MONGODB_URI: mongo.getUri('paintsite-test'),
    JWT_SECRET: 'test-secret-that-is-definitely-longer-than-32-chars',
    CLIENT_ORIGIN: 'http://localhost:5173',
    SITE_URL: 'https://painter.example',
    UPLOAD_DIR: uploadDir,
    GOOGLE_PLACES_API_KEY: '',
    GOOGLE_PLACE_ID: '',
  });

  const { createApp } = await import('../src/app.js');
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all(Object.values(mongoose.models).map((m) => m.syncIndexes()));

  return {
    app: createApp(),
    uploadDir,
    async teardown() {
      await mongoose.disconnect();
      await mongo.stop();
      await fs.rm(uploadDir, { recursive: true, force: true });
    },
  };
}

export async function createUser({ email = 'owner@example.com', password = 'CorrectHorse42', role = 'admin' } = {}) {
  const { AdminUser } = await import('../src/models/AdminUser.js');
  return AdminUser.create({ name: 'Test User', email, role, passwordHash: await AdminUser.hashPassword(password) });
}
