import { ArrowRight, Check, MapPin, PaintRoller } from 'lucide-react';
import { CtaSection } from '../components/CtaSection.jsx';
import { GoogleReviewButtons } from '../components/GoogleReviews.jsx';
import { Seo } from '../components/layout/Seo.jsx';
import { ProjectCard } from '../components/ProjectCard.jsx';
import { ReviewCard } from '../components/ReviewCard.jsx';
import { ServiceCard } from '../components/ServiceCard.jsx';
import { Button } from '../components/ui/Button.jsx';
import { NamedIcon, WhatsAppIcon, RingingPhone as Phone } from '../components/ui/Icons.jsx';
import { ResponsiveImage } from '../components/ui/ResponsiveImage.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';
import { SectionHeading } from '../components/ui/SectionHeading.jsx';
import { EmptyState } from '../components/ui/States.jsx';
import { BENEFITS, HERO_POINTS } from '../config/content.js';
import { useSettings } from '../context/SettingsContext.jsx';
import { photo } from '../data/images.js';
import { PROJECTS } from '../data/projects.js';
import { SERVICES } from '../data/services.js';
import { TESTIMONIALS } from '../data/testimonials.js';
import { Link } from 'react-router';
import { useWhatsApp } from '../hooks/useWhatsApp.js';
import { telHref } from '../utils/format.js';

const HERO_PHOTOS = {
  main: photo('/images/projects/front-stairs-house.jpg', 'Three-storey rendered home with freshly oiled timber entry stairs'),
  top: photo('/images/projects/roof-tiles-2.jpg', 'Tiled roof restored and coated in deep red'),
  bottom: photo('/images/projects/staircase-dark-stain.jpg', 'Staircase stained a rich dark brown'),
};

function HeroCollage() {
  const { settings } = useSettings();
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      {/* Soft paint swatches behind the photos */}
      <div className="absolute -top-8 -right-6 -z-10 size-56 rounded-full bg-accent-200/60 blur-3xl anim-blob" aria-hidden="true" />
      <div className="absolute -bottom-10 -left-8 -z-10 size-64 rounded-full bg-navy-200/50 blur-3xl anim-blob [animation-delay:-6s]" aria-hidden="true" />

      <div className="grid grid-cols-5 grid-rows-2 gap-3 sm:gap-4">
        <div className="anim-pop col-span-3 row-span-2 overflow-hidden rounded-3xl shadow-lift ring-1 ring-black/5 [animation-delay:200ms]">
          <ResponsiveImage image={HERO_PHOTOS.main} priority className="anim-ken-burns aspect-[3/4] size-full object-cover" />
        </div>
        <div className="group anim-pop col-span-2 overflow-hidden rounded-3xl shadow-lift ring-1 ring-black/5 [animation-delay:350ms]">
          <ResponsiveImage image={HERO_PHOTOS.top} priority className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </div>
        <div className="group anim-pop col-span-2 overflow-hidden rounded-3xl shadow-lift ring-1 ring-black/5 [animation-delay:500ms]">
          <ResponsiveImage image={HERO_PHOTOS.bottom} priority className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </div>
      </div>

      {/* Floating info cards */}
      <div className="anim-float absolute -bottom-6 left-4 flex items-center [animation-delay:700ms] gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lift ring-1 ring-black/5 backdrop-blur sm:left-6">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
          <PaintRoller className="size-5" aria-hidden="true" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-bold text-navy-900">Interior & exterior</p>
          <p className="text-xs text-navy-600">Domestic & commercial</p>
        </div>
      </div>
      {settings.phone && (
        <a
          href={telHref(settings.phone)}
          className="anim-float absolute -top-5 right-4 hidden items-center [animation-delay:850ms] gap-2.5 rounded-full bg-navy-900 py-2 pr-4 pl-2 text-sm font-semibold text-white shadow-lift transition hover:bg-navy-800 sm:inline-flex"
        >
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent-500">
            <Phone className="size-4" aria-hidden="true" />
          </span>
          {settings.phone}
        </a>
      )}
    </div>
  );
}

function Hero() {
  const waLink = useWhatsApp()();
  const { settings } = useSettings();
  const stats = settings.stats || {};
  return (
    <section className="relative isolate overflow-hidden bg-beige-50">
      {/* Subtle dotted texture */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.35] [background-image:radial-gradient(var(--color-beige-300)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        aria-hidden="true"
      />

      <div className="container-page grid items-center gap-14 py-14 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-24">
        <div className="min-w-0">
          {settings.serviceAreas?.[0] && (
            <p className="mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-navy-700 shadow-soft ring-1 ring-beige-200">
              <MapPin className="size-4 text-accent-600" aria-hidden="true" />
              Painters in {settings.serviceAreas[0]} & Melbourne's south-east
            </p>
          )}
          <h1 className="animate-fade-up text-[2.6rem] [animation-delay:100ms] leading-[1.05] font-semibold text-navy-900 sm:text-6xl lg:text-[4.25rem]">
            Beautiful finishes,{' '}
            <span className="relative whitespace-nowrap text-accent-600">
              honest prices.
              <svg
                viewBox="0 0 300 18"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-3 w-full text-accent-300"
                aria-hidden="true"
              >
                <path className="anim-draw" d="M3 13 C 60 4, 140 3, 297 9" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mt-7 max-w-xl animate-fade-up [animation-delay:200ms] text-lg leading-relaxed text-navy-600 sm:text-xl">
            Careful preparation, quality paints and a tidy, reliable team for homes and businesses that want a finish that lasts.
            {stats.yearsExperience ? ` ${stats.yearsExperience}+ years of experience in every coat.` : ''}
          </p>
          <div className="mt-9 flex animate-fade-up flex-col gap-3 [animation-delay:300ms] sm:flex-row">
            <Button to="/contact?type=quote#enquiry" size="lg" iconRight={ArrowRight}>
              Get a Free Quote
            </Button>
            {waLink && (
              <Button href={waLink} external variant="whatsapp" size="lg" icon={WhatsAppIcon}>
                Chat on WhatsApp
              </Button>
            )}
          </div>
          <ul className="mt-10 flex flex-col gap-3 border-t border-beige-200 pt-7 text-sm font-medium text-navy-700 sm:flex-row sm:flex-wrap sm:gap-x-5">
            {HERO_POINTS.map((p, i) => (
              <li key={p} className="flex animate-fade-up items-center gap-2.5" style={{ animationDelay: `${450 + i * 100}ms` }}>
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                  <Check className="size-3.5" aria-hidden="true" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <HeroCollage />
        </div>
      </div>
    </section>
  );
}

const MARQUEE_ITEMS = [
  'Interior painting',
  'Exterior painting',
  'Roof restoration',
  'Deck oiling',
  'Timber staining',
  'Feature walls',
  'Commercial repaints',
  'Spray finishes',
];

function ServiceMarquee() {
  const row = (hidden) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {MARQUEE_ITEMS.map((t) => (
        <li key={t} className="flex items-center gap-6 pr-6 font-display text-xl font-semibold whitespace-nowrap text-white sm:text-2xl">
          {t}
          <span className="size-2 rounded-full bg-accent-500" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee bg-navy-900 py-5">
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="anim-marquee flex w-max">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  );
}

function Benefits() {
  return (
    <section aria-labelledby="benefits-title" className="relative z-10 bg-beige-50">
      <div className="container-page py-14 sm:py-16">
        <h2 id="benefits-title" className="sr-only">
          Why customers choose us
        </h2>
        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <Reveal as="li" key={b.title} delay={i * 100} variant="zoom" className="group relative -m-3 flex gap-4 rounded-2xl p-3 transition hover:bg-white hover:shadow-soft has-focus-visible:ring-2 has-focus-visible:ring-accent-500">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-accent-600 shadow-soft ring-1 ring-beige-200 transition duration-300 group-hover:-translate-y-1 group-hover:rotate-6 group-hover:bg-accent-600 group-hover:text-white group-hover:shadow-lift">
                <NamedIcon name={b.icon} className="size-6" />
              </span>
              <div>
                <h3 className="font-sans text-base font-bold text-navy-900">
                  <Link to="/about" className="after:absolute after:inset-0 focus-visible:outline-none">
                    {b.title}
                  </Link>
                </h3>
                <p className="mt-1 text-[15px] leading-relaxed text-navy-600">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FeaturedServices() {
  const items = SERVICES.slice(0, 6);
  return (
    <section className="section" aria-labelledby="services-title">
      <div className="container-page">
        <Reveal variant="left" className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="What we do"
            title={<span id="services-title">Painting services for every surface</span>}
            description="From a single feature wall to a full commercial repaint, we handle preparation, painting and clean-up."
          />
          <Button to="/services" variant="outline" iconRight={ArrowRight}>
            All services
          </Button>
        </Reveal>
        <div className="mt-12">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 3) * 120} variant="zoom">
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function RecentProjects() {
  const items = PROJECTS.filter((p) => p.featured).slice(0, 6);
  return (
    <section className="section bg-navy-950" aria-labelledby="projects-title">
      <div className="container-page">
        <Reveal variant="left" className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            light
            eyebrow="Recent projects"
            title={<span id="projects-title">Work we're proud of</span>}
            description="A selection of recent interior, exterior and commercial jobs — including before-and-after transformations."
          />
          <Button to="/portfolio" variant="outlineLight" iconRight={ArrowRight}>
            View full portfolio
          </Button>
        </Reveal>
        <div className="mt-12">
          {items.length === 0 ? (
            <EmptyState title="New projects coming soon">Check back shortly to see our latest work.</EmptyState>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p, i) => (
                <Reveal as="li" key={p.slug} delay={(i % 3) * 120} variant="zoom">
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function ReviewsPreview() {
  const items = TESTIMONIALS.slice(0, 3);
  return (
    <section className="section bg-beige-50" aria-labelledby="reviews-title">
      <div className="container-page">
        <Reveal variant="left" className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Customer reviews"
            title={<span id="reviews-title">What our customers say</span>}
            description="Feedback from customers we've worked with, plus our reviews on Google."
          />
          {items.length > 0 && <GoogleReviewButtons />}
        </Reveal>
        <div className="mt-12">
          {items.length === 0 ? (
            <EmptyState title="Read our reviews on Google" action={<GoogleReviewButtons />}>
              See what customers say about us on our Google Business Profile.
            </EmptyState>
          ) : (
            <>
              <ul className="grid gap-6 md:grid-cols-3">
                {items.map((r, i) => (
                  <Reveal as="li" key={`${r.name}-${i}`} delay={i * 80}>
                    <ReviewCard review={r} />
                  </Reveal>
                ))}
              </ul>
              <div className="mt-10 text-center">
                <Button to="/reviews" variant="outline" iconRight={ArrowRight}>
                  Read all reviews
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function ServiceAreas() {
  const { settings } = useSettings();
  if (!settings.serviceAreas?.length) return null;
  return (
    <section className="border-t border-beige-200 bg-beige-50 py-12">
      <div className="container-page flex flex-col gap-5 md:flex-row md:items-center">
        <Reveal as="h2" variant="left" className="flex shrink-0 items-center gap-2 font-sans text-sm font-bold tracking-wider text-navy-500 uppercase">
          <MapPin className="anim-pin size-4 text-accent-600" aria-hidden="true" />
          Areas we serve
        </Reveal>
        <ul className="flex flex-wrap gap-2.5">
          {settings.serviceAreas.map((area, i) => (
            <Reveal as="li" key={area} variant="zoom" delay={i * 70}>
              <span
                className="group inline-flex cursor-default items-center gap-1.5 rounded-full bg-white py-1.5 pr-4 pl-3 text-sm font-semibold text-navy-800 shadow-xs ring-1 ring-beige-200 transition duration-300 hover:-translate-y-0.5 hover:bg-accent-600 hover:text-white hover:shadow-soft hover:ring-accent-600"
                style={{ '--i': i }}
              >
                <MapPin className="anim-pin size-4 text-accent-600 transition-colors group-hover:text-white" aria-hidden="true" />
                {area}
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Home() {
  const { settings } = useSettings();
  const area = settings.serviceAreas?.[0] || settings.address?.city;
  return (
    <>
      <Seo
        title={area ? `Professional Painters in ${area}` : 'Professional Painting Services'}
        description={`Interior, exterior and commercial painting${area ? ` in ${area}` : ''}. Quality materials, careful preparation and on-time completion. Get a free quote or chat with us on WhatsApp.`}
      />
      <Hero />
      <ServiceMarquee />
      <Benefits />
      <FeaturedServices />
      <RecentProjects />
      <ReviewsPreview />
      <ServiceAreas />
      <CtaSection />
    </>
  );
}
