import { Quote } from 'lucide-react';
import { formatDate } from '../utils/format.js';
import { StarRating } from './ui/StarRating.jsx';

/** A customer testimonial from src/data/testimonials.js. */
export function ReviewCard({ review }) {
  return (
    <figure className="card flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        {review.rating ? <StarRating value={review.rating} /> : <span />}
        <Quote className="size-7 text-beige-300" aria-hidden="true" />
      </div>
      <blockquote className="mt-4 flex-1 leading-relaxed text-navy-700">
        <p className="whitespace-pre-line">{review.text}</p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-navy-100 pt-4">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-beige-100 font-bold text-navy-700" aria-hidden="true">
          {review.name.trim().charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-navy-900">{review.name}</p>
          <p className="text-sm text-navy-500">
            {[review.location, formatDate(review.date, { month: 'short', year: 'numeric' })].filter(Boolean).join(' · ')}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
