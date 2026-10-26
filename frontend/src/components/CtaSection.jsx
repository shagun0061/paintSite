import { Phone } from 'lucide-react';
import { SITE_IMAGES } from '../config/site.js';
import { useSettings } from '../context/SettingsContext.jsx';
import { useWhatsApp } from '../hooks/useWhatsApp.js';
import { telHref } from '../utils/format.js';
import { Button } from './ui/Button.jsx';
import { WhatsAppIcon } from './ui/Icons.jsx';
import { Reveal } from './ui/Reveal.jsx';
import { ResponsiveImage } from './ui/ResponsiveImage.jsx';

export function CtaSection({
  title = 'Ready to transform your space?',
  text = 'Tell us about your project and we will arrange a free, no-obligation site visit and written quote.',
}) {
  const { settings } = useSettings();
  const link = useWhatsApp()();
  return (
    <section className="section">
      <div className="container-page">
        <Reveal className="relative isolate overflow-hidden rounded-3xl bg-navy-900 px-6 py-14 sm:px-12 lg:py-20">
          <ResponsiveImage image={SITE_IMAGES.colour} alt="" sizes="100vw" className="absolute inset-0 -z-10 size-full object-cover opacity-15" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-950/90 via-navy-900/80 to-navy-800/70" aria-hidden="true" />
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
            <p className="mt-4 text-lg text-navy-100">{text}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button to="/contact?type=quote#enquiry" size="lg">
                Get a Free Quote
              </Button>
              {link && (
                <Button href={link} external variant="whatsapp" size="lg" icon={WhatsAppIcon}>
                  Chat on WhatsApp
                </Button>
              )}
            </div>
            {settings.phone && (
              <p className="mt-6 text-navy-200">
                or call{' '}
                <a href={telHref(settings.phone)} className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-accent-300">
                  <Phone className="size-4" aria-hidden="true" />
                  {settings.phone}
                </a>
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
