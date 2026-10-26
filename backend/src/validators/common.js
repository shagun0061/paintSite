import { z } from 'zod';

export const objectIdParam = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id'),
});

export const slugParam = z.object({
  slug: z.string().regex(/^[a-z0-9-]{1,100}$/, 'Invalid slug'),
});

export const pageQuery = {
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
};

export const trimmed = (max) => z.string().trim().max(max);

/** Optional text that may be sent as an empty string. */
export const optionalText = (max) => trimmed(max).optional().default('');

export const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9][0-9\s\-().]{6,22}$/, 'Enter a valid phone number');

// Only https URLs (or empty) — blocks javascript:, data:, etc.
export const httpsUrl = z
  .string()
  .trim()
  .max(1000)
  .refine((v) => v === '' || /^https:\/\/[^\s]+$/i.test(v), 'Must be an https:// URL')
  .optional()
  .default('');

const imageUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v.startsWith('/uploads/') || /^https:\/\/[^\s]+$/i.test(v), 'Invalid image URL');

export const image = z.object({
  url: imageUrl,
  alt: optionalText(200),
  width: z.number().int().positive().max(20000).optional(),
  height: z.number().int().positive().max(20000).optional(),
  variants: z
    .array(z.object({ width: z.number().int().positive().max(20000), url: imageUrl }))
    .max(8)
    .optional()
    .default([]),
});

export const booleanQuery = z
  .enum(['true', 'false'])
  .optional()
  .transform((v) => (v === undefined ? undefined : v === 'true'));
