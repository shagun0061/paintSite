import { MessageSquareQuote } from 'lucide-react';
import { useState } from 'react';
import { GoogleReviewsSection } from '../components/GoogleReviews.jsx';
import { Seo } from '../components/layout/Seo.jsx';
import { PageHero } from '../components/PageHero.jsx';
import { ReviewCard } from '../components/ReviewCard.jsx';
import { ReviewForm } from '../components/ReviewForm.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { EmptyState, ErrorState, SkeletonCards } from '../components/ui/States.jsx';
import { StarRating } from '../components/ui/StarRating.jsx';
import { SITE_IMAGES } from '../config/site.js';
import { useSettings } from '../context/SettingsContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { fetchReviews } from '../services/endpoints.js';

export default function Reviews() {
  const { settings } = useSettings();
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useAsync((o) => fetchReviews({ page, limit: 9 }, o), [page]);
  const items = data?.items || [];
  const summary = data?.summary;

  const changePage = (p) => {
    setPage(p);
    document.getElementById('website-reviews')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Seo
        title="Customer Reviews"
        description={`Read reviews of ${settings.businessName} from customers on our website and on Google, or share your own experience.`}
      />
      <PageHero
        eyebrow="Reviews"
        title="What our customers say"
        description="Honest feedback from the people we've worked for. Website reviews are checked by our team before publishing; Google reviews are shown exactly as they appear on Google."
        image={SITE_IMAGES.hero}
        breadcrumb={[{ label: 'Reviews' }]}
      />

      <div className="container-page -mt-10 relative z-10 sm:-mt-14">
        <GoogleReviewsSection />
      </div>

      <section id="website-reviews" className="section scroll-mt-24" aria-labelledby="site-reviews-title">
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge tone="accent">Reviews left on this website</Badge>
              <h2 id="site-reviews-title" className="mt-3 text-3xl font-semibold">
                Website testimonials
              </h2>
            </div>
            {summary?.count > 0 && (
              <p className="flex flex-wrap items-center gap-2 text-navy-700">
                <span className="text-2xl font-bold text-navy-900">{summary.average.toFixed(1)}</span>
                <StarRating value={summary.average} />
                <span>
                  average from {summary.count} website review{summary.count === 1 ? '' : 's'}
                </span>
              </p>
            )}
          </div>

          <div className="mt-10">
            {loading && !data ? (
              <SkeletonCards count={3} className="h-0" />
            ) : error ? (
              <ErrorState error={error} onRetry={reload} title="Reviews couldn't be loaded" />
            ) : items.length === 0 ? (
              <EmptyState icon={MessageSquareQuote} title="No website reviews yet">
                Be the first to share your experience using the form below.
              </EmptyState>
            ) : (
              <>
                <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((r) => (
                    <li key={r._id}>
                      <ReviewCard review={r} />
                    </li>
                  ))}
                </ul>
                <Pagination page={page} totalPages={data.pagination.totalPages} onChange={changePage} className="mt-10" />
              </>
            )}
          </div>
        </div>
      </section>

      <section id="write-review" className="section scroll-mt-24 bg-beige-50" aria-labelledby="write-review-title">
        <div className="container-page grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 id="write-review-title" className="text-3xl font-semibold">
              Share your experience
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-navy-600">
              Had work done by us? Your feedback helps other customers and helps us keep improving. Reviews appear here once
              approved by our team.
            </p>
            <p className="mt-4 text-navy-600">
              You can also leave a review on our Google Business Profile using the “Review Us on Google” button above.
            </p>
          </div>
          <div className="card p-6 sm:p-8 lg:col-span-3">
            <ReviewForm />
          </div>
        </div>
      </section>
    </>
  );
}
