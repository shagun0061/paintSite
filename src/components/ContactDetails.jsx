import { useState } from 'react';
import { ArrowRight, Car, CircleCheck, Clock, ExternalLink, Mail, MapPin, MessageSquareText, Search } from 'lucide-react';
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

/** Decorative "street map" backdrop for the service-areas header. */
function MapPattern() {
  return (
    <svg className="absolute inset-0 size-full" viewBox="0 0 320 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="sa-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.2" fill="white" fillOpacity="0.09" />
        </pattern>
      </defs>
      <rect width="320" height="140" fill="url(#sa-dots)" />
      <g fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="6" strokeLinecap="round">
        <path d="M-10 100 C 60 80, 110 120, 180 90 S 290 40, 340 60" />
        <path d="M70 -10 C 80 40, 60 90, 95 150" />
        <path d="M230 -10 L 250 150" />
      </g>
      <path
        className="anim-draw"
        d="M24 128 C 90 108, 150 142, 215 120 S 290 104, 304 110"
        fill="none"
        stroke="var(--color-accent-400)"
        strokeWidth="2.5"
        strokeDasharray="6 7"
        strokeLinecap="round"
      />
      <circle cx="24" cy="128" r="4" fill="var(--color-accent-400)" />
      <circle cx="304" cy="110" r="4" fill="none" stroke="var(--color-accent-400)" strokeWidth="2" />
    </svg>
  );
}

/** Sidebar card listing the suburbs we service, with a quick "do you cover me?" check. */
export function ServiceAreasCard() {
  const { settings } = useSettings();
  const waLink = useWhatsApp();
  const [query, setQuery] = useState('');
  const areas = settings.serviceAreas || [];
  if (!areas.length) return null;

  const q = query.trim().toLowerCase();
  const matches = q ? areas.filter((a) => a.toLowerCase().includes(q)) : areas;
  const exact = q && areas.find((a) => a.toLowerCase() === q);
  const askLink = waLink(
    `Hello, do you provide painting services in ${query.trim() || 'my area'}? I'd like to get a quote.`,
  );

  return (
    <div className="card overflow-hidden">
      {/* Header: map-style banner */}
      <div className="relative isolate overflow-hidden bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 px-6 pt-6 pb-12 text-white">
        <MapPattern />
        <span className="absolute top-5 right-6 flex size-11 items-center justify-center" aria-hidden="true">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-500/40" />
          <span className="relative inline-flex size-11 items-center justify-center rounded-full bg-accent-600 shadow-lift ring-4 ring-white/10">
            <MapPin className="size-5" />
          </span>
        </span>
        <p className="relative text-[11px] font-bold tracking-[0.16em] text-accent-300 uppercase">We come to you</p>
        <h2 className="relative mt-1 text-xl font-semibold text-white">Areas we service</h2>
        <p className="relative mt-1.5 max-w-[16rem] text-sm leading-relaxed text-navy-200">
          <span className="font-semibold text-white">{areas.length} suburbs</span> covered with free on-site quotes.
        </p>
      </div>

      <div className="p-6">
        {/* Suburb check */}
        <label htmlFor="suburb-check" className="text-sm font-semibold text-navy-900">
          Do we cover your suburb?
        </label>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-navy-400" aria-hidden="true" />
          <input
            id="suburb-check"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your suburb…"
            autoComplete="address-level2"
            className="w-full rounded-xl border border-navy-200 bg-navy-50/60 py-2.5 pr-3 pl-10 text-sm text-navy-900 transition placeholder:text-navy-400 focus:border-accent-500 focus:bg-white focus:ring-4 focus:ring-accent-100 focus:outline-none"
          />
        </div>

        <div aria-live="polite" className="min-h-0">
          {q && (matches.length > 0 ? (
            <p className="anim-pop mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-800 ring-1 ring-emerald-100">
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <span>
                {exact ? (
                  <>Great news, we service <strong>{exact}</strong>!</>
                ) : (
                  <>Good news, we cover {matches.length === 1 ? <strong>{matches[0]}</strong> : `${matches.length} matching suburbs`}.</>
                )}
              </span>
            </p>
          ) : (
            <div className="anim-pop mt-3 rounded-xl bg-accent-50 px-3.5 py-3 text-sm text-navy-700 ring-1 ring-accent-100">
              <p>
                <strong className="text-navy-900">{query.trim()}</strong> isn&apos;t on our list, but get in touch and we&apos;ll let you know if we can help.
              </p>
              {askLink && (
                <a
                  href={askLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 font-semibold text-accent-600 hover:underline"
                >
                  <WhatsAppIcon className="size-4" aria-hidden="true" />
                  Ask us about {query.trim()}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Suburb tags */}
        <ul className="mt-5 grid grid-cols-2 gap-2">
          {areas.map((area, i) => {
            const hit = q && matches.includes(area);
            const dim = q && !hit;
            return (
              <li
                key={area}
                style={{ '--i': i, animationDelay: `${i * 60}ms` }}
                className={cn(
                  'anim-pop group flex min-w-0 cursor-default items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold ring-1 transition duration-300',
                  hit
                    ? 'bg-accent-600 text-white shadow-soft ring-accent-600'
                    : 'bg-white text-navy-800 ring-navy-100 hover:-translate-y-0.5 hover:bg-accent-50 hover:ring-accent-200',
                  dim && 'opacity-40',
                )}
              >
                <MapPin className={cn('anim-pin size-4 shrink-0', hit ? 'text-white' : 'text-accent-600')} aria-hidden="true" />
                <span className="truncate">{area}</span>
              </li>
            );
          })}
        </ul>

        {/* Footer note */}
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-dashed border-navy-200 px-4 py-3">
          <Car className="size-5 shrink-0 text-navy-400" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-navy-600">
            Live nearby? <span className="font-semibold text-navy-900">Just ask</span>, we&apos;re happy to check.
          </p>
        </div>
      </div>
    </div>
  );
}
