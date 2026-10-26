import bcrypt from 'bcryptjs';
import { AUTH_COOKIE } from '../config/constants.js';
import { sessionCookieOptions, setSessionCookie } from '../middleware/auth.js';
import { AdminUser } from '../models/AdminUser.js';
import { AppError } from '../utils/AppError.js';

// Compared against when the email doesn't exist so response timing doesn't
// reveal which emails have accounts.
let dummyHash;
const getDummyHash = async () => (dummyHash ??= await AdminUser.hashPassword('timing-equaliser-not-a-password'));

const INVALID = 'Incorrect email or password.';

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await AdminUser.findOne({ email }).select('+passwordHash +failedLoginAttempts +lockUntil');

  if (!user) {
    await bcrypt.compare(password, await getDummyHash());
    throw new AppError(401, INVALID);
  }
  if (user.isLocked()) {
    throw new AppError(423, 'This account is temporarily locked after too many failed attempts. Try again in 15 minutes.');
  }
  if (!(await user.verifyPassword(password))) {
    await user.registerFailedLogin();
    throw new AppError(401, INVALID);
  }

  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  user.lastLoginAt = new Date();
  await user.save();

  setSessionCookie(res, user);
  res.json({ user });
}

export function logout(_req, res) {
  res.clearCookie(AUTH_COOKIE, sessionCookieOptions());
  res.status(204).end();
}

export function me(req, res) {
  res.json({ user: req.user });
}

export async function changePassword(req, res) {
  const user = await AdminUser.findById(req.user.id).select('+passwordHash');
  if (!(await user.verifyPassword(req.body.currentPassword))) {
    throw new AppError(400, 'Current password is incorrect.', { currentPassword: 'Current password is incorrect.' });
  }
  user.passwordHash = await AdminUser.hashPassword(req.body.newPassword);
  user.tokenVersion += 1; // signs out every other session
  await user.save();
  setSessionCookie(res, user);
  res.json({ message: 'Password updated.' });
}

/* ---- Admin user management (admin role only) ---- */

export async function listUsers(_req, res) {
  const users = await AdminUser.find().sort({ createdAt: 1 });
  res.json({ items: users });
}

export async function createUser(req, res) {
  const { name, email, password, role } = req.body;
  const user = await AdminUser.create({ name, email, role, passwordHash: await AdminUser.hashPassword(password) });
  res.status(201).json({ user });
}

export async function deleteUser(req, res) {
  if (req.params.id === req.user.id) throw new AppError(400, 'You cannot delete your own account.');
  const user = await AdminUser.findById(req.params.id);
  if (!user) throw new AppError(404, 'User not found');
  if (user.role === 'admin' && (await AdminUser.countDocuments({ role: 'admin' })) <= 1) {
    throw new AppError(400, 'At least one admin account must remain.');
  }
  await user.deleteOne();
  res.status(204).end();
}
