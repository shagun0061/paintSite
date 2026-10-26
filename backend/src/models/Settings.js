import mongoose, { Schema } from 'mongoose';
import { defaultSettings } from '../config/defaultSettings.js';

const SINGLETON_KEY = 'business';

const settingsSchema = new Schema(
  {
    key: { type: String, default: SINGLETON_KEY, unique: true, immutable: true },
    businessName: { type: String, trim: true, maxlength: 100 },
    tagline: { type: String, trim: true, maxlength: 160 },
    logoUrl: { type: String, trim: true, maxlength: 500 },
    phone: { type: String, trim: true, maxlength: 25 },
    email: { type: String, trim: true, maxlength: 254 },
    whatsappNumber: { type: String, trim: true, maxlength: 15 },
    whatsappDefaultMessage: { type: String, trim: true, maxlength: 500 },
    address: {
      street: { type: String, trim: true, maxlength: 160 },
      city: { type: String, trim: true, maxlength: 80 },
      region: { type: String, trim: true, maxlength: 80 },
      postalCode: { type: String, trim: true, maxlength: 20 },
      country: { type: String, trim: true, maxlength: 60 },
    },
    geo: { lat: Number, lng: Number },
    serviceAreas: [{ type: String, trim: true, maxlength: 80 }],
    workingHours: [{ _id: false, days: String, hours: String }],
    googleMapsUrl: { type: String, trim: true, maxlength: 500 },
    googleReviewUrl: { type: String, trim: true, maxlength: 500 },
    googleMapsEmbedUrl: { type: String, trim: true, maxlength: 1000 },
    social: { facebook: String, instagram: String, youtube: String },
    stats: { yearsExperience: Number, projectsCompleted: Number, teamSize: Number },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret._id;
        delete ret.__v;
        delete ret.key;
        return ret;
      },
    },
  },
);

/** Returns the single settings document, creating it from defaults if needed. */
settingsSchema.statics.getSingleton = async function getSingleton() {
  return this.findOneAndUpdate(
    { key: SINGLETON_KEY },
    { $setOnInsert: { key: SINGLETON_KEY, ...defaultSettings } },
    { upsert: true, new: true },
  );
};

export const Settings = mongoose.model('Settings', settingsSchema);
