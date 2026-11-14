import { StarRating } from './ui/StarRating.jsx';
import { GoogleIcon } from './ui/Icons.jsx';

/** A review fetched live from Google (see useGoogleReviews). Attribution is required by Google. */
export function GoogleReviewCard({ review }) {
  const Author = review.authorUrl ? 'a' : 'span';
  const authorProps = review.authorUrl ? { href: review.authorUrl, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <figure className="card flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <StarRating value={review.rating} />
        <GoogleIcon className="size-5 shrink-0" />
      </div>
      <blockquote className="mt-4 flex-1 leading-relaxed text-navy-700">
        <p className="line-clamp-6 whitespace-pre-line">{review.text}</p>
      </blockquote>
      {review.url && (
        <a
          href={review.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 self-start text-sm font-semibold text-navy-600 underline-offset-4 hover:underline"
        >
          Read on Google
        </a>
      )}
      <figcaption className="mt-6 flex items-center gap-3 border-t border-navy-100 pt-4">
        {review.photo ? (
          <img src={review.photo} alt="" className="size-10 rounded-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
        ) : (
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-beige-100 font-bold text-navy-700" aria-hidden="true">
            {review.author.trim().charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <Author {...authorProps} className="block truncate font-semibold text-navy-900 hover:underline">
            {review.author}
          </Author>
          {review.when && <p className="text-sm text-navy-500">{review.when}</p>}
        </div>
      </figcaption>
    </figure>
  );
}
