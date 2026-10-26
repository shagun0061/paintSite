import { ExternalLink, PenLine } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.jsx';
import { Button } from './ui/Button.jsx';
import { GoogleIcon } from './ui/Icons.jsx';

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
