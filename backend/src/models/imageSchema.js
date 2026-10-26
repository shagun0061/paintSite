import { Schema } from 'mongoose';

/** A stored image plus its responsive variants (used for srcset). */
export const imageSchema = new Schema(
  {
    url: { type: String, required: true, trim: true, maxlength: 500 },
    alt: { type: String, trim: true, maxlength: 200, default: '' },
    width: Number,
    height: Number,
    variants: [{ _id: false, width: Number, url: { type: String, maxlength: 500 } }],
  },
  { _id: false },
);
