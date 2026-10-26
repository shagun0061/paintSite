import mongoose, { Schema } from 'mongoose';
import { ENQUIRY_STATUSES, ENQUIRY_TYPES, PROPERTY_TYPES } from '../config/constants.js';

const enquirySchema = new Schema(
  {
    type: { type: String, enum: ENQUIRY_TYPES, default: 'contact' },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, required: true, trim: true, maxlength: 25 },
    email: { type: String, trim: true, lowercase: true, maxlength: 254, default: '' },
    service: { type: String, required: true, trim: true, maxlength: 100 },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, trim: true, maxlength: 2000, default: '' },
    propertyType: { type: String, enum: [...PROPERTY_TYPES, ''], default: '' },
    preferredStart: { type: String, trim: true, maxlength: 40, default: '' },
    status: { type: String, enum: ENQUIRY_STATUSES, default: 'New' },
    notes: { type: String, trim: true, maxlength: 2000, default: '' },
  },
  { timestamps: true },
);

enquirySchema.index({ status: 1, createdAt: -1 });
enquirySchema.index({ type: 1, createdAt: -1 });

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
