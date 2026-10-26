import mongoose, { Schema } from 'mongoose';
import { REVIEW_STATUSES } from '../config/constants.js';

/**
 * Testimonials submitted through this website. Google reviews are never
 * stored here — they are fetched live from Google's official API.
 */
const reviewSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    location: { type: String, trim: true, maxlength: 80, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true, maxlength: 1500 },
    status: { type: String, enum: REVIEW_STATUSES, default: 'pending' },
    moderatedAt: Date,
    moderatedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  },
  { timestamps: true },
);

reviewSchema.index({ status: 1, createdAt: -1 });

export const Review = mongoose.model('Review', reviewSchema);
