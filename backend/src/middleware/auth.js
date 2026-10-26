import jwt from 'jsonwebtoken';
import { AUTH_COOKIE, SESSION_TTL_MS } from '../config/constants.js';
import { env } from '../config/env.js';
import { AdminUser } from '../models/AdminUser.js';
import { AppError } from '../utils/AppError.js';

const JWT_OPTIONS = { algorithms: ['HS256'], issuer: 'paintsite', audience: 'paintsite-admin' };

export function signSession(user) {
  return jwt.sign({ sub: user.id, role: user.role, tv: user.tokenVersion }, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: Math.floor(SESSION_TTL_MS / 1000),
    issuer: JWT_OPTIONS.issuer,
    audience: JWT_OPTIONS.audience,
  });
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: 'strict',
    path: '/api',
  };
}

export function setSessionCookie(res, user) {
  res.cookie(AUTH_COOKIE, signSession(user), { ...sessionCookieOptions(), maxAge: SESSION_TTL_MS });
}

/** Requires a valid admin session cookie; attaches the user to `req.user`. */
export async function requireAuth(req, _res, next) {
  const token = req.cookies?.[AUTH_COOKIE];
  if (!token) throw new AppError(401, 'Please sign in to continue.');

  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET, JWT_OPTIONS);
  } catch {
    throw new AppError(401, 'Your session has expired. Please sign in again.');
  }

  const user = await AdminUser.findById(payload.sub);
  if (!user || user.tokenVersion !== payload.tv) {
    throw new AppError(401, 'Your session is no longer valid. Please sign in again.');
  }

  req.user = user;
  next();
}

export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError(403, 'You do not have permission to perform this action.'));
  }
  return next();
};

/**
 * CSRF defence for cookie-authenticated mutations: browsers can't send this
 * custom header cross-site without a CORS preflight, which our CORS policy
 * rejects for unknown origins. Complements the SameSite=strict cookie.
 */
export function requireCsrfHeader(req, _res, next) {
  const safe = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);
  if (safe || req.get('x-requested-with') === 'XMLHttpRequest') return next();
  return next(new AppError(403, 'Missing request header.'));
}
