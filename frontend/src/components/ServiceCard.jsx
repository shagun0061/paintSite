import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useWhatsApp } from '../hooks/useWhatsApp.js';
import { whatsappMessages } from '../utils/whatsapp.js';
import { Button } from './ui/Button.jsx';
import { NamedIcon, WhatsAppIcon } from './ui/Icons.jsx';
import { ResponsiveImage } from './ui/ResponsiveImage.jsx';

/** Compact card used on the home page. */
export function ServiceCard({ service }) {
  return (
    <article className="group card flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden">
        <ResponsiveImage
          image={service.image}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute bottom-0 left-5 inline-flex size-12 translate-y-1/2 items-center justify-center rounded-xl bg-accent-600 text-white shadow-soft">
          <NamedIcon name={service.icon} className="size-6" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 pt-9">
        <h3 className="text-xl font-semibold">{service.title}</h3>
        <p className="mt-2 flex-1 leading-relaxed text-navy-600">{service.summary}</p>
        <Link
          to={`/services#${service.slug}`}
          className="mt-5 inline-flex items-center gap-1.5 font-semibold text-accent-600 hover:text-accent-700"
        >
          Learn more <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          <span className="sr-only">about {service.title}</span>
        </Link>
      </div>
    </article>
  );
}

/** "Get a Quote" for a specific service: WhatsApp with a pre-filled message, plus a form fallback. */
export function ServiceQuoteButtons({ service, size = 'md' }) {
  const whatsapp = useWhatsApp();
  const link = whatsapp(whatsappMessages.service(service.title));
  const formLink = `/contact?type=quote&service=${encodeURIComponent(service.title)}#enquiry`;
  return (
    <div className="flex flex-wrap gap-3">
      {link ? (
        <>
          <Button href={link} external variant="whatsapp" size={size} icon={WhatsAppIcon}>
            Get a Quote
          </Button>
          <Button to={formLink} variant="outline" size={size}>
            Request by form
          </Button>
        </>
      ) : (
        <Button to={formLink} size={size}>
          Get a Quote
        </Button>
      )}
    </div>
  );
}
