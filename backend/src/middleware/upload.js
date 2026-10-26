import multer from 'multer';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

/**
 * Accepts up to 10 images in memory. The MIME type here is only a first
 * filter — imageService re-checks the real file signature with sharp.
 */
export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxUploadBytes, files: 10, fields: 5 },
  fileFilter(_req, file, cb) {
    if (ALLOWED_MIME.has(file.mimetype)) return cb(null, true);
    return cb(new AppError(415, `"${file.originalname}" is not a supported image. Use JPG, PNG or WebP.`));
  },
}).array('images', 10);
