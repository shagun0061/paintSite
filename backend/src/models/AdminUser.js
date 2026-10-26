import bcrypt from 'bcryptjs';
import mongoose, { Schema } from 'mongoose';
import { ADMIN_ROLES, LOCK_TIME_MS, MAX_LOGIN_ATTEMPTS } from '../config/constants.js';

const BCRYPT_ROUNDS = 12;

const adminUserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ADMIN_ROLES, default: 'editor' },
    // Bumped on password change so existing sessions stop working.
    tokenVersion: { type: Number, default: 0 },
    failedLoginAttempts: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, select: false },
    lastLoginAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        delete ret.failedLoginAttempts;
        delete ret.lockUntil;
        delete ret.tokenVersion;
        delete ret.__v;
        return ret;
      },
    },
  },
);

adminUserSchema.statics.hashPassword = (password) => bcrypt.hash(password, BCRYPT_ROUNDS);

adminUserSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

adminUserSchema.methods.isLocked = function isLocked() {
  return Boolean(this.lockUntil && this.lockUntil > Date.now());
};

adminUserSchema.methods.registerFailedLogin = async function registerFailedLogin() {
  this.failedLoginAttempts = (this.failedLoginAttempts || 0) + 1;
  if (this.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
    this.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
    this.failedLoginAttempts = 0;
  }
  await this.save();
};

export const AdminUser = mongoose.model('AdminUser', adminUserSchema);
