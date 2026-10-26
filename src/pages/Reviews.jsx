import { GoogleReviewsSection } from '../components/GoogleReviews.jsx';
import { Seo } from '../components/layout/Seo.jsx';
import { PageHero } from '../components/PageHero.jsx';
import { ReviewCard } from '../components/ReviewCard.jsx';
import { StarRating } from '../components/ui/StarRating.jsx';
import { SITE_IMAGES } from '../config/site.js';
import { useSettings } from '../context/SettingsContext.jsx';
import { TESTIMONIALS } from '../data/testimonials.js';
import { cn } from '../utils/cn.js';

export default function Reviews() {
  const { settings } = useSettings();
  const rated = TESTIMONIALS.filter((t) => t.rating);
  const average = rated.length ? rated.reduce((sum, t) => sum + t.rating, 0) / rated.length : null;

  return (
    <>
      <Seo
        title="Customer Reviews"
        description={`Read what customers say about ${settings.businessName}, or leave us a review on Google.`}
      />
      <PageHero
        eyebrow="Reviews"
        title="What our customers say"
        description="Honest feedback from the people we've worked for. Read our Google reviews, or share your own experience."
        image={SITE_IMAGES.hero}
        breadcrumb={[{ label: 'Reviews' }]}
      />

      <div className={cn('container-page relative z-10 -mt-10 sm:-mt-14', !TESTIMONIALS.length && 'pb-16 sm:pb-24')}>
        <GoogleReviewsSection />
      </div>

      {TESTIMONIALS.length > 0 && (
        <section className="section" aria-labelledby="testimonials-title">
          <div className="container-page">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 id="testimonials-title" className="text-3xl font-semibold">
                Customer testimonials
              </h2>
              {average != null && (
                <p className="flex flex-wrap items-center gap-2 text-navy-700">
                  <span className="text-2xl font-bold text-navy-900">{average.toFixed(1)}</span>
                  <StarRating value={average} />
                  <span>
                    from {rated.length} testimonial{rated.length === 1 ? '' : 's'}
                  </span>
                </p>
              )}
            </div>
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {TESTIMONIALS.map((r, i) => (
                <li key={`${r.name}-${i}`}>
                  <ReviewCard review={r} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
