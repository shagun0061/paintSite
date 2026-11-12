import { ArrowRight, Clock, ExternalLink, Mail, MapPin, MessageSquareText } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.jsx';
import { useWhatsApp } from '../hooks/useWhatsApp.js';
import { cn } from '../utils/cn.js';
import { formatAddress, telHref } from '../utils/format.js';
import { openStatus, rowCoversDay } from '../utils/hours.js';
import { useGoogleLinks } from './GoogleReviews.jsx';
import { WhatsAppIcon, RingingPhone as Phone } from './ui/Icons.jsx';

function OptionCard({ href, external, onClick, icon: Icon, iconCls, title, text, action, highlight }) {
  const Tag = href ? 'a' : 'button';
  return (
    <Tag
      {...(href ? { href } : { type: 'button', onClick })}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(
        'group relative flex h-full flex-col rounded-2xl bg-white p-6 text-left shadow-soft ring-1 transition duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:outline-none',
        highlight ? 'ring-accent-200' : 'ring-navy-100',
      )}
    >
      {highlight && (
        <span className="absolute -top-3 right-5 rounded-full bg-accent-600 px-3 py-1 text-xs font-bold text-white shadow-soft">{highlight}</span>
      )}
      <span className={cn('inline-flex size-12 items-center justify-center rounded-xl text-white', iconCls)}>
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <span className="mt-5 block font-display text-xl font-semibold text-navy-900">{title}</span>
      <span className="mt-1.5 block flex-1 leading-relaxed text-navy-600">{text}</span>
      <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-accent-600">
        {action}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Tag>
  );
}

/** Three clear ways to get in touch, shown at the top of the Contact page. */
export function ContactOptions() {
  const { settings } = useSettings();
  const waLink = useWhatsApp()();
  const scrollToForm = () => document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {settings.phone && (
        <li>
          <OptionCard
            href={telHref(settings.phone)}
            icon={Phone}
            iconCls="bg-accent-600"
            title="Call us"
            text="Talk to us directly about your job and book a free on-site quote."
            action={settings.phone}
          />
        </li>
      )}
      {waLink && (
        <li>
          <OptionCard
            href={waLink}
            external
            icon={WhatsAppIcon}
            iconCls="bg-whatsapp-dark"
            title="WhatsApp us"
            text="Send a few photos of the area and we'll give you a rough idea quickly."
            action="Open WhatsApp"
            highlight="Fastest reply"
          />
        </li>
      )}
      <li>
        <OptionCard
          onClick={scrollToForm}
          icon={MessageSquareText}
          iconCls="bg-navy-700"
          title="Fill in the form"
          text="Tell us about your project in detail and we'll get back to you."
          action="Go to the form"
        />
      </li>
    </ul>
  );
}

/** Compact sidebar card: phone, email, address, hours and a small map. */
export function ContactInfoCard() {
  const { settings } = useSettings();
  const { profileUrl } = useGoogleLinks();
  const address = formatAddress(settings.address);
  const hours = settings.workingHours || [];
  const status = openStatus(hours);

  const rowCls = 'flex gap-3.5 py-4';
  const iconCls = 'mt-0.5 size-5 shrink-0 text-accent-600';

  return (
    <div className="card overflow-hidden">
      <div className="px-6 pt-6">
        <h2 className="text-xl font-semibold">Contact details</h2>
      </div>
      <dl className="divide-y divide-navy-100 px-6">
        {settings.phone && (
          <div className={rowCls}>
            <Phone className={iconCls} aria-hidden="true" />
            <div>
              <dt className="text-sm text-navy-500">Phone</dt>
              <dd>
                <a href={telHref(settings.phone)} className="font-semibold text-navy-900 hover:text-accent-600">
                  {settings.phone}
                </a>
              </dd>
            </div>
          </div>
        )}
        {settings.email && (
          <div className={rowCls}>
            <Mail className={iconCls} aria-hidden="true" />
            <div className="min-w-0">
              <dt className="text-sm text-navy-500">Email</dt>
              <dd>
                <a href={`mailto:${settings.email}`} className="font-semibold break-all text-navy-900 hover:text-accent-600">
                  {settings.email}
                </a>
              </dd>
            </div>
          </div>
        )}
        {address && (
          <div className={rowCls}>
            <MapPin className={iconCls} aria-hidden="true" />
            <div>
              <dt className="text-sm text-navy-500">Address</dt>
              <dd className="font-semibold text-navy-900">
                <address className="not-italic">{address}</address>
                {profileUrl && (
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:underline"
                  >
                    View on Google Maps <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                )}
              </dd>
            </div>
          </div>
        )}
        {hours.length > 0 && (
          <div className={rowCls}>
            <Clock className={iconCls} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <dt className="flex items-center gap-2 text-sm text-navy-500">
                Working hours
                {status && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold',
                      status.open ? 'bg-emerald-50 text-emerald-700' : 'bg-navy-50 text-navy-500',
                    )}
                  >
                    <span className={cn('size-1.5 rounded-full', status.open ? 'bg-emerald-500' : 'bg-navy-300')} aria-hidden="true" />
                    {status.open ? 'Open now' : 'Closed now'}
                  </span>
                )}
              </dt>
              <dd className="mt-2 space-y-1.5">
                {hours.map((h) => {
                  const today = status && rowCoversDay(h, status.today);
                  return (
                    <div key={h.days} className={cn('text-sm', today ? 'font-semibold text-navy-900' : 'text-navy-600')}>
                      <span className="block">{h.days}</span>
                      <span className={cn('block', today ? 'text-accent-600' : 'text-navy-900')}>{h.hours}</span>
                    </div>
                  );
                })}
              </dd>
            </div>
          </div>
        )}
      </dl>
      <MapEmbed className="block h-56 w-full border-0 grayscale-[30%]" />
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
