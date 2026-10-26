import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

let memoryServer = null;

/**
 * Connects to MongoDB. MONGODB_URI=memory starts a throwaway in-memory
 * MongoDB (development only) so the project runs without a local install.
 */
export async function connectDB(uri) {
  let target = uri;
  if (uri === 'memory') {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    target = memoryServer.getUri('paintsite');
    logger.warn('Using in-memory MongoDB — data is lost when the server stops.');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(target, { serverSelectionTimeoutMS: 10_000 });
  logger.info(`MongoDB connected (${mongoose.connection.name})`);
  return { inMemory: Boolean(memoryServer) };
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
