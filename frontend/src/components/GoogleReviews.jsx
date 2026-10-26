import { ExternalLink, PenLine } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { fetchGoogleReviews } from '../services/endpoints.js';
import { pluralize } from '../utils/format.js';
import { GoogleReviewCard } from './ReviewCard.jsx';
import { Button } from './ui/Button.jsx';
import { GoogleIcon } from './ui/Icons.jsx';
import { StarRating } from './ui/StarRating.jsx';

/** Profile link: the owner's configured URL, else a Google Maps search for the business. */
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

/**
 * Google rating + reviews, shown only when the official Places API is
 * configured on the server. Otherwise only the profile/review links render.
 */
export function GoogleReviewsSection() {
  const { data } = useAsync((o) => fetchGoogleReviews(o), []);
  const live = data?.enabled && data?.available;

  return (
    <section aria-labelledby="google-reviews-title" className="rounded-3xl border border-navy-100 bg-white p-6 shadow-soft sm:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold tracking-wider text-navy-500 uppercase">
            <GoogleIcon className="size-5" /> Reviews from Google
          </p>
          <h2 id="google-reviews-title" className="mt-2 text-2xl font-semibold sm:text-3xl">
            See what customers say on Google
          </h2>
          {live && data.rating != null && (
            <p className="mt-3 flex flex-wrap items-center gap-2 text-navy-700">
              <span className="text-2xl font-bold text-navy-900">{data.rating.toFixed(1)}</span>
              <StarRating value={data.rating} />
              {data.userRatingCount != null && <span>based on {pluralize(data.userRatingCount, 'Google review')}</span>}
            </p>
          )}
          {!live && (
            <p className="mt-3 max-w-xl text-navy-600">
              Our Google reviews live on our Google Business Profile. Read them there, or share your own experience.
            </p>
          )}
        </div>
        <GoogleReviewButtons />
      </div>

      {live && data.reviews?.length > 0 && (
        <>
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.reviews.map((r, i) => (
              <li key={`${r.publishTime}-${i}`}>
                <GoogleReviewCard review={r} />
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-navy-500">
            Reviews and rating provided by Google. Showing the most relevant reviews selected by Google.
          </p>
        </>
      )}
    </section>
  );
}
