import mongoose, { Schema } from 'mongoose';
import { SERVICE_ICONS } from '../config/constants.js';
import { imageSchema } from './imageSchema.js';

const serviceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary: { type: String, required: true, trim: true, maxlength: 240 },
    description: { type: String, trim: true, maxlength: 3000, default: '' },
    features: [{ type: String, trim: true, maxlength: 120 }],
    icon: { type: String, enum: SERVICE_ICONS, default: 'PaintRoller' },
    image: imageSchema,
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

serviceSchema.index({ active: 1, order: 1 });

export const Service = mongoose.model('Service', serviceSchema);
