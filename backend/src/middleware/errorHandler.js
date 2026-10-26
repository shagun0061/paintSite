import mongoose from 'mongoose';
import multer from 'multer';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

export function notFoundHandler(req, _res, next) {
  next(new AppError(404, `No API route for ${req.method} ${req.originalUrl}`));
}

function normalize(err) {
  if (err instanceof AppError) return err;

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return new AppError(413, `Each image must be smaller than ${env.MAX_UPLOAD_MB} MB.`);
    }
    return new AppError(400, `Upload error: ${err.message}`);
  }
  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]));
    return new AppError(400, 'Please check the highlighted fields.', details);
  }
  if (err instanceof mongoose.Error.CastError) return new AppError(400, `Invalid ${err.path}`);
  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return new AppError(409, `A record with that ${field} already exists.`);
  }
  if (err?.type === 'entity.parse.failed') return new AppError(400, 'Malformed JSON body.');
  if (err?.type === 'entity.too.large') return new AppError(413, 'Request body is too large.');
  if (err?.message?.startsWith('Not allowed by CORS')) return new AppError(403, 'Origin not allowed.');
  // 4xx errors from Express internals (e.g. a missing static upload).
  if (err?.status >= 400 && err.status < 500) {
    return new AppError(err.status, err.expose ? err.message : err.status === 404 ? 'Not found' : 'Bad request');
  }

  return null;
}

// Express recognises error handlers by their 4-argument signature.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  const known = normalize(err);
  if (!known) logger.error(`${req.method} ${req.originalUrl}`, err);

  const status = known?.status ?? 500;
  const message = known?.message ?? (env.isProduction ? 'Something went wrong. Please try again.' : err.message);

  res.status(status).json({
    error: { message, ...(known?.details && { details: known.details }) },
  });
}
