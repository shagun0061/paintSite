import { Check } from 'lucide-react';
import { CtaSection } from '../components/CtaSection.jsx';
import { Seo } from '../components/layout/Seo.jsx';
import { PageHero } from '../components/PageHero.jsx';
import { ServiceQuoteButtons } from '../components/ServiceCard.jsx';
import { NamedIcon } from '../components/ui/Icons.jsx';
import { ResponsiveImage } from '../components/ui/ResponsiveImage.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';
import { SITE_IMAGES } from '../config/site.js';
import { useSettings } from '../context/SettingsContext.jsx';
import { SERVICES } from '../data/services.js';
import { cn } from '../utils/cn.js';

export default function Services() {
  const { settings } = useSettings();
  const area = settings.serviceAreas?.[0] || settings.address?.city;

  return (
    <>
      <Seo
        title={area ? `Painting Services in ${area}` : 'Painting Services'}
        description="Interior and exterior house painting, commercial painting, textures and decorative finishes, waterproofing and wall repairs, and wood polishing."
      />
      <PageHero
        eyebrow="Services"
        title="Professional painting services"
        description="Every service includes surface preparation, quality materials, furniture and floor protection, and a full clean-up when we're done."
        image={SITE_IMAGES.colour}
        breadcrumb={[{ label: 'Services' }]}
      />

      <section className="section">
        <div className="container-page">
          <div className="space-y-20 lg:space-y-28">
              {SERVICES.map((s, i) => (
                <Reveal as="article" key={s.slug} id={s.slug} className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  <div className={cn('relative', i % 2 === 1 && 'lg:order-2')}>
                    <ResponsiveImage
                      image={s.image}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift"
                    />
                  </div>
                  <div>
                    <span className="inline-flex size-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                      <NamedIcon name={s.icon} className="size-6" />
                    </span>
                    <h2 className="mt-5 text-3xl font-semibold sm:text-4xl">{s.title}</h2>
                    <p className="mt-4 text-lg leading-relaxed text-navy-700">{s.summary}</p>
                    {s.description && <p className="mt-4 leading-relaxed text-navy-600">{s.description}</p>}
                    {s.features?.length > 0 && (
                      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                        {s.features.map((f) => (
                          <li key={f} className="flex gap-2.5 text-navy-800">
                            <Check className="mt-0.5 size-5 shrink-0 text-accent-600" strokeWidth={2.5} aria-hidden="true" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-8">
                      <ServiceQuoteButtons service={s} />
                    </div>
                  </div>
                </Reveal>
              ))}
          </div>
        </div>
      </section>

      <CtaSection title="Not sure which service you need?" text="Send us a few photos on WhatsApp or book a free site visit — we'll recommend the right approach." />
    </>
  );
}
