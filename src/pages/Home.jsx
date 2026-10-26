import { ArrowRight, Check, MapPin } from 'lucide-react';
import { CtaSection } from '../components/CtaSection.jsx';
import { GoogleReviewButtons } from '../components/GoogleReviews.jsx';
import { Seo } from '../components/layout/Seo.jsx';
import { ProjectCard } from '../components/ProjectCard.jsx';
import { ReviewCard } from '../components/ReviewCard.jsx';
import { ServiceCard } from '../components/ServiceCard.jsx';
import { Button } from '../components/ui/Button.jsx';
import { NamedIcon, WhatsAppIcon } from '../components/ui/Icons.jsx';
import { ResponsiveImage } from '../components/ui/ResponsiveImage.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';
import { SectionHeading } from '../components/ui/SectionHeading.jsx';
import { EmptyState } from '../components/ui/States.jsx';
import { BENEFITS, HERO_POINTS } from '../config/content.js';
import { SITE_IMAGES } from '../config/site.js';
import { useSettings } from '../context/SettingsContext.jsx';
import { PROJECTS } from '../data/projects.js';
import { SERVICES } from '../data/services.js';
import { TESTIMONIALS } from '../data/testimonials.js';
import { useWhatsApp } from '../hooks/useWhatsApp.js';

function Hero() {
  const waLink = useWhatsApp()();
  const { settings } = useSettings();
  const stats = settings.stats || {};
  return (
    <section className="relative isolate overflow-hidden bg-navy-950">
      <ResponsiveImage
        image={SITE_IMAGES.hero}
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 size-full object-cover object-[70%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-950/10" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-navy-950/60 to-transparent" aria-hidden="true" />

      <div className="container-page flex min-h-[calc(100svh-4.5rem)] flex-col justify-center py-20 md:min-h-[640px] lg:min-h-[720px]">
        <div className="max-w-2xl animate-fade-up">
          {settings.serviceAreas?.[0] && (
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur">
              <MapPin className="size-4 text-accent-400" aria-hidden="true" />
              Painters serving {settings.serviceAreas[0]} & surrounding areas
            </p>
          )}
          <h1 className="text-4xl leading-[1.08] font-semibold text-white sm:text-5xl lg:text-6xl">
            Transform Your Space with <span className="text-accent-400">Professional Painting</span> Services.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100 sm:text-xl">
            Careful preparation, premium paints and a tidy, reliable team — for homes and businesses that want a finish that lasts.
            {stats.yearsExperience ? ` ${stats.yearsExperience}+ years of experience in every coat.` : ''}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button to="/contact?type=quote#enquiry" size="lg" iconRight={ArrowRight}>
              Get a Free Quote
            </Button>
            {waLink && (
              <Button href={waLink} external variant="whatsapp" size="lg" icon={WhatsAppIcon}>
                Chat on WhatsApp
              </Button>
            )}
          </div>
          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-navy-100">
            {HERO_POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Check className="size-4 text-accent-400" aria-hidden="true" strokeWidth={3} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
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
            <Reveal as="li" key={b.title} delay={i * 80} className="flex gap-4">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-accent-600 shadow-soft ring-1 ring-beige-200">
                <NamedIcon name={b.icon} className="size-6" />
              </span>
              <div>
                <h3 className="font-sans text-base font-bold text-navy-900">{b.title}</h3>
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
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="What we do"
            title={<span id="services-title">Painting services for every surface</span>}
            description="From a single feature wall to a full commercial repaint, we handle preparation, painting and clean-up."
          />
          <Button to="/services" variant="outline" iconRight={ArrowRight}>
            All services
          </Button>
        </div>
        <div className="mt-12">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 3) * 80}>
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
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            light
            eyebrow="Recent projects"
            title={<span id="projects-title">Work we're proud of</span>}
            description="A selection of recent interior, exterior and commercial jobs — including before-and-after transformations."
          />
          <Button to="/portfolio" variant="outlineLight" iconRight={ArrowRight}>
            View full portfolio
          </Button>
        </div>
        <div className="mt-12">
          {items.length === 0 ? (
            <EmptyState title="New projects coming soon">Check back shortly to see our latest work.</EmptyState>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p, i) => (
                <Reveal as="li" key={p.slug} delay={(i % 3) * 80}>
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
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Customer reviews"
            title={<span id="reviews-title">What our customers say</span>}
            description="Feedback from customers we've worked with, plus our reviews on Google."
          />
          {items.length > 0 && <GoogleReviewButtons />}
        </div>
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
        <h2 className="shrink-0 font-sans text-sm font-bold tracking-wider text-navy-500 uppercase">Areas we serve</h2>
        <ul className="flex flex-wrap gap-2">
          {settings.serviceAreas.map((area) => (
            <li key={area} className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-navy-800 ring-1 ring-beige-200">
              {area}
            </li>
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
      <Benefits />
      <FeaturedServices />
      <RecentProjects />
      <ReviewsPreview />
      <ServiceAreas />
      <CtaSection />
    </>
  );
}
