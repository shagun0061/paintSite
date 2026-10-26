import { Clock, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.jsx';
import { useWhatsApp } from '../hooks/useWhatsApp.js';
import { formatAddress, telHref } from '../utils/format.js';
import { useGoogleLinks } from './GoogleReviews.jsx';
import { Button } from './ui/Button.jsx';
import { WhatsAppIcon } from './ui/Icons.jsx';

function Row({ icon: Icon, label, children }) {
  return (
    <div className="flex gap-4">
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-beige-100 text-accent-600">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className="text-sm font-semibold text-navy-500">{label}</dt>
        <dd className="mt-0.5 font-semibold break-words text-navy-900">{children}</dd>
      </div>
    </div>
  );
}

export function ContactDetails() {
  const { settings } = useSettings();
  const waLink = useWhatsApp()();
  const { profileUrl } = useGoogleLinks();
  const address = formatAddress(settings.address, { multiline: true });

  return (
    <div className="space-y-8">
      {waLink && (
        <div className="rounded-2xl bg-whatsapp-dark p-6 text-white">
          <p className="flex items-center gap-2 text-lg font-bold">
            <WhatsAppIcon className="size-6" /> Fastest reply: WhatsApp
          </p>
          <p className="mt-1 text-white/85">Send photos of the area you want painted and we'll give you a rough idea straight away.</p>
          <Button href={waLink} external variant="light" className="mt-4 text-whatsapp-darker">
            Chat on WhatsApp
          </Button>
        </div>
      )}
      <dl className="space-y-6">
        {settings.phone && (
          <Row icon={Phone} label="Phone">
            <a href={telHref(settings.phone)} className="hover:text-accent-600">
              {settings.phone}
            </a>
          </Row>
        )}
        {settings.email && (
          <Row icon={Mail} label="Email">
            <a href={`mailto:${settings.email}`} className="hover:text-accent-600">
              {settings.email}
            </a>
          </Row>
        )}
        {address.length > 0 && (
          <Row icon={MapPin} label="Address">
            <address className="not-italic">
              {address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            {profileUrl && (
              <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:underline">
                View on Google Maps <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            )}
          </Row>
        )}
        {settings.workingHours?.length > 0 && (
          <Row icon={Clock} label="Working hours">
            <ul className="space-y-0.5">
              {settings.workingHours.map((h) => (
                <li key={h.days} className="flex justify-between gap-6">
                  <span className="font-medium text-navy-600">{h.days}</span>
                  <span>{h.hours}</span>
                </li>
              ))}
            </ul>
          </Row>
        )}
      </dl>
    </div>
  );
}

/** Lazy-loaded Google Maps embed (no API key needed). */
export function MapEmbed({ className }) {
  const { settings } = useSettings();
  const address = formatAddress(settings.address);
  const src =
    settings.googleMapsEmbedUrl ||
    (address ? `https://www.google.com/maps?q=${encodeURIComponent(`${settings.businessName}, ${address}`)}&output=embed` : null);
  if (!src) return null;
  return (
    <iframe
      title={`Map showing the location of ${settings.businessName}`}
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={className}
      allowFullScreen
    />
  );
}
