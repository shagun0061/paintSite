import { z } from 'zod';
import {
  ADMIN_ROLES,
  ENQUIRY_STATUSES,
  ENQUIRY_TYPES,
  PROJECT_CATEGORIES,
  PROPERTY_TYPES,
  REVIEW_STATUSES,
  SERVICE_ICONS,
} from '../config/constants.js';
import { booleanQuery, httpsUrl, image, optionalText, pageQuery, phone, trimmed } from './common.js';

export * from './common.js';

/* ---------- Auth ---------- */

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email').max(254),
  password: z.string().min(1, 'Password is required').max(200),
});

export const passwordSchema = z
  .string()
  .min(10, 'Password must be at least 10 characters')
  .max(200)
  .refine((v) => /[a-zA-Z]/.test(v) && /\d/.test(v), 'Password must contain letters and numbers');

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: passwordSchema,
});

export const createAdminSchema = z.object({
  name: trimmed(80).min(2),
  email: z.string().trim().toLowerCase().email().max(254),
  password: passwordSchema,
  role: z.enum(ADMIN_ROLES).default('editor'),
});

/* ---------- Enquiries ---------- */

export const enquiryCreateSchema = z.object({
  type: z.enum(ENQUIRY_TYPES).default('contact'),
  name: trimmed(80).min(2, 'Please enter your name'),
  phone,
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254)
    .refine((v) => v === '' || z.string().email().safeParse(v).success, 'Enter a valid email')
    .optional()
    .default(''),
  service: trimmed(100).min(2, 'Please choose a service'),
  location: trimmed(120).min(2, 'Please enter your location'),
  message: optionalText(2000),
  propertyType: z.enum([...PROPERTY_TYPES, '']).optional().default(''),
  preferredStart: optionalText(40),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(200).optional().default(''),
});

export const enquiryListQuery = z.object({
  ...pageQuery,
  limit: pageQuery.limit.default(20),
  status: z.enum(ENQUIRY_STATUSES).optional(),
  type: z.enum(ENQUIRY_TYPES).optional(),
  q: trimmed(80).optional(),
});

export const enquiryUpdateSchema = z
  .object({
    status: z.enum(ENQUIRY_STATUSES).optional(),
    notes: trimmed(2000).optional(),
  })
  .refine((v) => v.status !== undefined || v.notes !== undefined, 'Nothing to update');

/* ---------- Reviews ---------- */

export const reviewCreateSchema = z.object({
  name: trimmed(80).min(2, 'Please enter your name'),
  location: optionalText(80),
  rating: z.coerce.number().int().min(1, 'Please choose a rating').max(5),
  text: trimmed(1500).min(10, 'Please write at least 10 characters'),
  website: z.string().max(200).optional().default(''),
});

export const reviewListQuery = z.object({
  ...pageQuery,
  limit: pageQuery.limit.default(9),
});

export const adminReviewListQuery = z.object({
  ...pageQuery,
  limit: pageQuery.limit.default(20),
  status: z.enum(REVIEW_STATUSES).optional(),
});

export const reviewModerateSchema = z.object({
  status: z.enum(REVIEW_STATUSES),
});

/* ---------- Projects ---------- */

export const projectListQuery = z.object({
  ...pageQuery,
  limit: pageQuery.limit.default(9),
  category: z.enum(PROJECT_CATEGORIES).optional(),
  featured: booleanQuery,
});

export const adminProjectListQuery = z.object({
  ...pageQuery,
  limit: pageQuery.limit.default(20),
  category: z.enum(PROJECT_CATEGORIES).optional(),
  q: trimmed(80).optional(),
});

export const projectSchema = z.object({
  title: trimmed(120).min(3, 'Title must be at least 3 characters'),
  category: z.enum(PROJECT_CATEGORIES),
  summary: optionalText(240),
  description: optionalText(5000),
  location: optionalText(120),
  completedAt: z
    .union([z.literal(''), z.null(), z.coerce.date()])
    .optional()
    .transform((v) => (v === '' || v === undefined ? null : v)),
  coverImage: image,
  beforeImage: image.nullable().optional().default(null),
  afterImage: image.nullable().optional().default(null),
  gallery: z.array(image).max(30).optional().default([]),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
});

export const projectPublishSchema = z
  .object({ published: z.boolean().optional(), featured: z.boolean().optional() })
  .refine((v) => v.published !== undefined || v.featured !== undefined, 'Nothing to update');

/* ---------- Services ---------- */

export const serviceSchema = z.object({
  title: trimmed(100).min(3),
  summary: trimmed(240).min(10, 'Summary must be at least 10 characters'),
  description: optionalText(3000),
  features: z.array(trimmed(120).min(1)).max(12).optional().default([]),
  icon: z.enum(SERVICE_ICONS).optional().default('PaintRoller'),
  image: image.nullable().optional().default(null),
  order: z.coerce.number().int().min(0).max(1000).optional().default(0),
  active: z.boolean().optional().default(true),
});

/* ---------- Settings ---------- */

const statNumber = z.union([z.null(), z.coerce.number().int().min(0).max(1_000_000)]).optional();

export const settingsSchema = z.object({
  businessName: trimmed(100).min(2),
  tagline: optionalText(160),
  logoUrl: httpsUrl.or(z.string().trim().startsWith('/uploads/')),
  phone: phone.or(z.literal('')),
  email: z
    .string()
    .trim()
    .max(254)
    .refine((v) => v === '' || z.string().email().safeParse(v).success, 'Enter a valid email'),
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^$|^[1-9]\d{7,14}$/, 'Use international format digits only, e.g. 15551234567 (no +, spaces or dashes)'),
  whatsappDefaultMessage: optionalText(500),
  address: z.object({
    street: optionalText(160),
    city: optionalText(80),
    region: optionalText(80),
    postalCode: optionalText(20),
    country: optionalText(60),
  }),
  geo: z
    .object({
      lat: z.union([z.null(), z.coerce.number().min(-90).max(90)]).optional(),
      lng: z.union([z.null(), z.coerce.number().min(-180).max(180)]).optional(),
    })
    .optional()
    .default({}),
  serviceAreas: z.array(trimmed(80).min(1)).max(30).default([]),
  workingHours: z.array(z.object({ days: trimmed(60).min(1), hours: trimmed(60).min(1) })).max(10).default([]),
  googleMapsUrl: httpsUrl,
  googleReviewUrl: httpsUrl,
  googleMapsEmbedUrl: httpsUrl.refine(
    (v) => v === '' || /^https:\/\/(www\.)?google\.[a-z.]+\/maps\/embed/i.test(v),
    'Must be a Google Maps embed URL (https://www.google.com/maps/embed?...)',
  ),
  social: z
    .object({ facebook: httpsUrl, instagram: httpsUrl, youtube: httpsUrl })
    .optional()
    .default({}),
  stats: z
    .object({ yearsExperience: statNumber, projectsCompleted: statNumber, teamSize: statNumber })
    .optional()
    .default({}),
});
