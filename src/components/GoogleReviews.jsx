import { ExternalLink, PenLine } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.jsx';
import { useGoogleReviews } from '../hooks/useGoogleReviews.js';
import { GoogleReviewCard } from './GoogleReviewCard.jsx';
import { Button } from './ui/Button.jsx';
import { GoogleIcon } from './ui/Icons.jsx';
import { Reveal } from './ui/Reveal.jsx';
import { StarRating } from './ui/StarRating.jsx';
import { SkeletonCards } from './ui/States.jsx';

/** Profile link: the configured URL, else a Google Maps search for the business. */
export function useGoogleLinks() {
  const { settings } = useSettings();
  const query = [settings.businessName, settings.address?.city].filter(Boolean).join(' ');
  return {
    profileUrl:
      settings.googleMapsUrl || (query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : null),
    reviewUrl: settings.googleReviewUrl || null,
  };
}

export function GoogleReviewButtons({ light = false, size = 'md' }) {
  const { profileUrl, reviewUrl } = useGoogleLinks();
  return (
    <div className="flex flex-wrap gap-3">
      {profileUrl && (
        <Button href={profileUrl} external variant={light ? 'light' : 'outline'} size={size} icon={GoogleIcon} iconRight={ExternalLink}>
          Read Google Reviews
        </Button>
      )}
      {reviewUrl && (
        <Button href={reviewUrl} external variant={light ? 'outlineLight' : 'navy'} size={size} icon={PenLine}>
          Review Us on Google
        </Button>
      )}
    </div>
  );
}

/** "4.9 ★★★★★ from 23 Google reviews" */
export function GoogleRatingSummary({ data }) {
  if (data.rating == null) return null;
  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex flex-wrap items-center gap-2 text-navy-700 hover:underline"
    >
      <GoogleIcon className="size-5" />
      <span className="text-2xl font-bold text-navy-900">{data.rating.toFixed(1)}</span>
      <StarRating value={data.rating} />
      <span>
        from {data.total} Google review{data.total === 1 ? '' : 's'}
      </span>
    </a>
  );
}

/**
 * Live Google reviews grid. Renders `fallback` when the API key isn't set or
 * loading fails, so the site never shows a broken section.
 */
export function LiveGoogleReviews({ limit, fallback = null, showSummary = true, animate = false, wrap = (c) => c }) {
  const state = useGoogleReviews();

  if (state.status === 'loading') return wrap(<SkeletonCards count={limit ?? 3} className="h-24" />);
  if (state.status !== 'ready' || !state.data.reviews.length) return fallback;

  const { data } = state;
  const reviews = limit ? data.reviews.slice(0, limit) : data.reviews;

  return wrap(
    <div>
      {showSummary && (
        <div className="mb-8">
          <GoogleRatingSummary data={data} />
        </div>
      )}
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) =>
          animate ? (
            <Reveal as="li" key={`${r.author}-${i}`} delay={i * 80}>
              <GoogleReviewCard review={r} />
            </Reveal>
          ) : (
            <li key={`${r.author}-${i}`}>
              <GoogleReviewCard review={r} />
            </li>
          ),
        )}
      </ul>
      <p className="mt-6 text-right text-xs text-navy-500">Reviews powered by Google</p>
    </div>
  );
}

/** Links to the business's Google reviews (which stay on Google). */
export function GoogleReviewsSection() {
  return (
    <section aria-labelledby="google-reviews-title" className="rounded-3xl border border-navy-100 bg-white p-6 shadow-soft sm:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold tracking-wider text-navy-500 uppercase">
            <GoogleIcon className="size-5" /> Reviews on Google
          </p>
          <h2 id="google-reviews-title" className="mt-2 text-2xl font-semibold sm:text-3xl">
            See what customers say on Google
          </h2>
          <p className="mt-3 max-w-xl text-navy-600">
            Our Google reviews live on our Google Business Profile. Read them there, or share your own experience.
          </p>
        </div>
        <GoogleReviewButtons />
      </div>
    </section>
  );
}
