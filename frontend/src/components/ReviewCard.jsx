import { Quote } from 'lucide-react';
import { formatDate } from '../utils/format.js';
import { GoogleIcon } from './ui/Icons.jsx';
import { StarRating } from './ui/StarRating.jsx';

/** Testimonial submitted on this website. */
export function ReviewCard({ review }) {
  return (
    <figure className="card flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <StarRating value={review.rating} />
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
            {[review.location, formatDate(review.createdAt, { day: 'numeric', month: 'short', year: 'numeric' })].filter(Boolean).join(' · ')}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

/** Review returned by the Google Places API, shown with the attribution Google requires. */
export function GoogleReviewCard({ review }) {
  const author = review.author || {};
  return (
    <figure className="card flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        {review.rating != null && <StarRating value={review.rating} />}
        <GoogleIcon className="size-5" />
      </div>
      <blockquote className="mt-4 flex-1 leading-relaxed text-navy-700">
        <p className="line-clamp-[8] whitespace-pre-line">{review.text}</p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-navy-100 pt-4">
        {author.photoUri ? (
          <img src={author.photoUri} alt="" className="size-10 rounded-full" referrerPolicy="no-referrer" loading="lazy" />
        ) : (
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-navy-50 font-bold text-navy-700" aria-hidden="true">
            {author.name?.charAt(0) || 'G'}
          </span>
        )}
        <div className="min-w-0">
          {author.uri ? (
            <a href={author.uri} target="_blank" rel="noopener noreferrer" className="block truncate font-semibold text-navy-900 hover:underline">
              {author.name}
            </a>
          ) : (
            <p className="truncate font-semibold text-navy-900">{author.name}</p>
          )}
          <p className="text-sm text-navy-500">{review.relativeTime} · on Google</p>
        </div>
      </figcaption>
    </figure>
  );
}
