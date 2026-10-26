import { Check } from 'lucide-react';
import { CtaSection } from '../components/CtaSection.jsx';
import { Seo } from '../components/layout/Seo.jsx';
import { PageHero } from '../components/PageHero.jsx';
import { NamedIcon } from '../components/ui/Icons.jsx';
import { ResponsiveImage } from '../components/ui/ResponsiveImage.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';
import { SectionHeading } from '../components/ui/SectionHeading.jsx';
import { BENEFITS, COMMITMENTS, PROCESS_STEPS } from '../config/content.js';
import { SITE_IMAGES } from '../config/site.js';
import { useSettings } from '../context/SettingsContext.jsx';

function Stats() {
  const { settings } = useSettings();
  const s = settings.stats || {};
  const items = [
    s.yearsExperience && { value: `${s.yearsExperience}+`, label: 'Years of experience' },
    s.projectsCompleted && { value: `${s.projectsCompleted}+`, label: 'Projects completed' },
    s.teamSize && { value: s.teamSize, label: 'Skilled team members' },
  ].filter(Boolean);
  if (!items.length) return null;
  return (
    <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-navy-100 pt-8">
      {items.map((it) => (
        <div key={it.label}>
          <dt className="sr-only">{it.label}</dt>
          <dd>
            <span className="block font-display text-3xl font-semibold text-navy-900 sm:text-4xl">{it.value}</span>
            <span className="mt-1 block text-sm text-navy-600">{it.label}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function About() {
  const { settings } = useSettings();
  return (
    <>
      <Seo
        title="About Us"
        description={`Meet ${settings.businessName}: experienced painters committed to careful preparation, quality materials and on-time completion.`}
      />
      <PageHero
        eyebrow="About us"
        title="Painters who care about the details"
        description="We're a local team of professional painters who believe a great finish starts long before the first coat — with honest advice, careful preparation and respect for your space."
        image={SITE_IMAGES.aboutTeam}
        breadcrumb={[{ label: 'About' }]}
      />

      <section className="section">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <ResponsiveImage
              image={SITE_IMAGES.aboutTeam}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-lift sm:aspect-[4/3] lg:aspect-[4/5]"
            />
            <ResponsiveImage
              image={SITE_IMAGES.aboutDetail}
              sizes="(min-width: 1024px) 20vw, 40vw"
              className="absolute -right-4 -bottom-8 hidden aspect-square w-48 rounded-2xl border-8 border-white object-cover shadow-lift sm:block lg:-right-10 lg:w-56"
            />
          </Reveal>
          <Reveal>
            <SectionHeading
              eyebrow="Our story"
              title={`${settings.businessName}: quality work, done right`}
            />
            <div className="prose-body mt-6 text-lg leading-relaxed text-navy-600">
              <p>
                We started with a simple idea: treat every home and business as if it were our own. That means turning up when
                we say we will, protecting your furniture and floors, and never cutting corners on preparation.
              </p>
              <p>
                Today our team handles everything from single rooms to full exterior repaints, decorative finishes and
                commercial projects — with the same attention to detail on every job.
              </p>
            </div>
            <Stats />
          </Reveal>
        </div>
      </section>

      <section className="section bg-beige-50" aria-labelledby="process-title">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="How we work"
            title={<span id="process-title">A simple, transparent process</span>}
            description="You always know what's happening, what it costs and when it will be finished."
          />
          <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 80} className="card relative p-6 pt-10">
                <span className="absolute -top-5 left-6 inline-flex size-10 items-center justify-center rounded-full bg-accent-600 font-display text-lg font-semibold text-white shadow-soft">
                  {i + 1}
                </span>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-navy-600">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="commitment-title">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Our commitment"
              title={<span id="commitment-title">What you can expect from us</span>}
              description="These promises apply to every project, large or small."
            />
            <ul className="mt-8 space-y-4">
              {COMMITMENTS.map((c) => (
                <li key={c} className="flex gap-3 text-navy-800">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-600">
                    <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {BENEFITS.map((b, i) => (
              <Reveal as="li" key={b.title} delay={i * 60} className="card p-6">
                <NamedIcon name={b.icon} className="size-8 text-accent-600" />
                <h3 className="mt-4 font-sans text-lg font-bold">{b.title}</h3>
                <p className="mt-1.5 leading-relaxed text-navy-600">{b.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaSection title="Let's talk about your project" />
    </>
  );
}
