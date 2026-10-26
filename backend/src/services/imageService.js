import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

const VARIANT_WIDTHS = [480, 960, 1600];
const ALLOWED_FORMATS = new Set(['jpeg', 'png', 'webp']);
const MAX_PIXELS = 50_000_000; // guards against decompression bombs
const PUBLIC_PREFIX = '/uploads/';

/**
 * Verifies the file really is an image (by decoding it, not trusting the
 * extension/MIME), strips metadata (EXIF/GPS), fixes orientation and writes
 * WebP variants for responsive srcset. Returns the stored image record.
 */
export async function processImage(buffer, folder = 'images') {
  let meta;
  try {
    meta = await sharp(buffer, { limitInputPixels: MAX_PIXELS }).metadata();
  } catch {
    throw new AppError(415, 'The file is not a valid image.');
  }
  if (!ALLOWED_FORMATS.has(meta.format)) throw new AppError(415, 'Only JPG, PNG and WebP images are supported.');

  const dir = path.join(env.uploadDir, folder);
  await fs.mkdir(dir, { recursive: true });

  const id = crypto.randomUUID();
  const base = sharp(buffer, { limitInputPixels: MAX_PIXELS }).rotate();
  const sourceWidth = (meta.orientation >= 5 ? meta.height : meta.width) || VARIANT_WIDTHS.at(-1);
  const widths = [...new Set(VARIANT_WIDTHS.map((w) => Math.min(w, sourceWidth)))];

  const variants = [];
  let largest;
  for (const width of widths) {
    const fileName = `${id}-${width}.webp`;
    const info = await base
      .clone()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(dir, fileName));
    const url = `${PUBLIC_PREFIX}${folder}/${fileName}`;
    variants.push({ width: info.width, url });
    largest = { url, width: info.width, height: info.height };
  }

  return { ...largest, alt: '', variants };
}

/** Resolves a public /uploads URL to a path guaranteed to be inside uploadDir. */
function resolveUploadPath(url) {
  if (typeof url !== 'string' || !url.startsWith(PUBLIC_PREFIX)) return null;
  const resolved = path.resolve(env.uploadDir, url.slice(PUBLIC_PREFIX.length));
  return resolved.startsWith(env.uploadDir + path.sep) ? resolved : null;
}

/** Deletes the files behind locally-stored images. External URLs are ignored. */
export async function deleteImages(images) {
  const urls = new Set();
  for (const img of images.filter(Boolean)) {
    urls.add(img.url);
    for (const v of img.variants || []) urls.add(v.url);
  }
  await Promise.all(
    [...urls].map(async (url) => {
      const file = resolveUploadPath(url);
      if (!file) return;
      try {
        await fs.unlink(file);
      } catch (err) {
        if (err.code !== 'ENOENT') logger.warn(`Could not delete ${file}: ${err.message}`);
      }
    }),
  );
}

/** Deletes images present in `before` but no longer referenced in `after`. */
export async function deleteRemovedImages(before, after) {
  const keep = new Set(after.filter(Boolean).map((img) => img.url));
  await deleteImages(before.filter((img) => img && !keep.has(img.url)));
}
