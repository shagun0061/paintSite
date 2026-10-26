import mongoose, { Schema } from 'mongoose';
import { PROJECT_CATEGORIES } from '../config/constants.js';
import { imageSchema } from './imageSchema.js';

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, enum: PROJECT_CATEGORIES, required: true },
    summary: { type: String, trim: true, maxlength: 240, default: '' },
    description: { type: String, trim: true, maxlength: 5000, default: '' },
    location: { type: String, trim: true, maxlength: 120, default: '' },
    completedAt: Date,
    coverImage: { type: imageSchema, required: true },
    beforeImage: imageSchema,
    afterImage: imageSchema,
    gallery: [imageSchema],
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);

projectSchema.index({ published: 1, category: 1, completedAt: -1 });
projectSchema.index({ published: 1, featured: 1, completedAt: -1 });

/** All images on a project, used for cleanup of uploaded files. */
projectSchema.methods.allImages = function allImages() {
  return [this.coverImage, this.beforeImage, this.afterImage, ...(this.gallery || [])].filter(Boolean);
};

export const Project = mongoose.model('Project', projectSchema);
