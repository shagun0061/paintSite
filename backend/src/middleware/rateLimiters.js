import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

const make = (windowMs, limit, message, extra = {}) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: () => env.isTest && !process.env.TEST_RATE_LIMITS,
    handler: (_req, res) => res.status(429).json({ error: { message } }),
    ...extra,
  });

export const apiLimiter = make(15 * 60 * 1000, 600, 'Too many requests. Please slow down and try again shortly.');

export const loginLimiter = make(15 * 60 * 1000, 10, 'Too many sign-in attempts. Please try again in 15 minutes.', {
  skipSuccessfulRequests: true,
});

export const enquiryLimiter = make(60 * 60 * 1000, 8, 'Too many enquiries from this connection. Please call or WhatsApp us instead.');

export const reviewLimiter = make(60 * 60 * 1000, 4, 'Too many reviews from this connection. Please try again later.');
