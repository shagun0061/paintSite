import { ArrowRight, ArrowUp, Clock, Facebook, Home, Images, Instagram, Mail, MapPin, MessageSquare, Navigation, PaintRoller, Star, Users, Youtube } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { NAV_LINKS } from '../../config/site.js';
import { useSettings } from '../../context/SettingsContext.jsx';
import { useWhatsApp } from '../../hooks/useWhatsApp.js';
import { cn } from '../../utils/cn.js';
import { formatAddress, telHref } from '../../utils/format.js';
import { openStatus, rowCoversDay } from '../../utils/hours.js';
import { WhatsAppIcon, RingingPhone as Phone } from '../ui/Icons.jsx';
import { Logo } from './Logo.jsx';

/** Pages that already end with their own call-to-action (or are the contact page) skip the footer's orange panel. */
const NO_CTA_PATHS = ['/', '/services', '/portfolio', '/about', '/contact'];

/** Icon shown before each page link (falls back to an arrow for unknown paths). */
const NAV_ICONS = { '/': Home, '/services': PaintRoller, '/portfolio': Images, '/about': Users, '/reviews': Star, '/contact': MessageSquare };

const SOCIAL = [
  { key: 'facebook', label: 'Facebook', Icon: Facebook },
  { key: 'instagram', label: 'Instagram', Icon: Instagram },
  { key: 'youtube', label: 'YouTube', Icon: Youtube },
];

function Heading({ children, extra }) {
  return (
    <div className="flex h-6 items-center gap-2.5">
      <h2 className="font-sans text-[13px] font-bold tracking-[0.14em] text-white uppercase">{children}</h2>
      {extra}
    </div>
  );
}

function useOpenStatus(hours) {
  const [status, setStatus] = useState(() => openStatus(hours));
  useEffect(() => {
    const id = setInterval(() => setStatus(openStatus(hours)), 60_000);
    return () => clearInterval(id);
  }, [hours]);
  return status;
}

/** Orange call-to-action panel at the top of the footer. */
function CtaPanel({ phone, waLink }) {
  return (
    <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-accent-500 via-accent-600 to-accent-700 px-6 py-10 shadow-lift sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-14 lg:py-12">
      <div className="absolute -top-24 -right-16 -z-10 size-72 rounded-full bg-white/15 blur-2xl" aria-hidden="true" />
      <div className="absolute -bottom-28 left-1/3 -z-10 size-72 rounded-full bg-accent-300/30 blur-3xl" aria-hidden="true" />
      <div className="max-w-xl">
        <h2 className="text-3xl leading-tight font-semibold text-white sm:text-4xl">Ready for a fresh coat?</h2>
        <p className="mt-3 text-lg text-accent-50/90">Free, no-obligation quotes. We usually reply the same day.</p>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
        {phone && (
          <a
            href={telHref(phone)}
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-6 py-3.5 font-semibold text-navy-900 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <Phone className="size-5 text-accent-600" aria-hidden="true" />
            {phone}
          </a>
        )}
        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-navy-950/20 px-6 py-3.5 font-semibold text-white ring-1 ring-white/40 transition hover:-translate-y-0.5 hover:bg-navy-950/30"
          >
            <WhatsAppIcon className="size-5" />
            WhatsApp us
          </a>
        )}
      </div>
    </div>
  );
}

export function Footer() {
  const { settings } = useSettings();
  const waLink = useWhatsApp()();
  const address = formatAddress(settings.address);
  const socials = SOCIAL.filter((s) => settings.social?.[s.key]);
  const hours = settings.workingHours || [];
  const status = useOpenStatus(hours);
  const directions =
    settings.googleMapsUrl || (address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : null);

  const { pathname } = useLocation();
  const showCta = !NO_CTA_PATHS.includes(pathname.replace(/\/$/, '') || '/');
  const linkCls = 'text-navy-300 transition-colors hover:text-white';

  return (
    <footer className="relative isolate overflow-hidden bg-navy-950 text-navy-300">
      {showCta && (
        <div className="container-page pt-16 sm:pt-20">
          <CtaPanel phone={settings.phone} waLink={waLink} />
        </div>
      )}

      <div className="container-page grid gap-x-10 gap-y-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:py-20">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-4 lg:pr-6">
          <Logo light imgClassName="h-16 sm:h-20 rounded-xl" />
          <p className="mt-5 max-w-xs leading-relaxed">{settings.tagline}</p>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-2">
              {socials.map(({ key, label, Icon }) => (
                <li key={key}>
                  <a
                    href={settings.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-10 items-center justify-center rounded-full bg-white/5 text-white ring-1 ring-white/10 transition hover:bg-accent-600 hover:ring-accent-600"
                  >
                    <Icon className="size-[18px]" aria-hidden="true" />
                    <span className="sr-only">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          <Link to="/contact?type=quote#enquiry" className="group mt-7 inline-flex items-center gap-2 font-semibold text-accent-300 hover:text-accent-200">
            Request a free quote
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        {/* Links */}
        <nav aria-label="Footer" className="lg:col-span-2">
          <Heading>Explore</Heading>
          <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3.5 sm:grid-cols-1">
            {NAV_LINKS.map((l) => {
              const Icon = NAV_ICONS[l.to] || ArrowRight;
              return (
                <li key={l.to}>
                  <Link to={l.to} className={cn('group inline-flex items-center gap-2.5', linkCls)}>
                    <Icon className="size-4 shrink-0 text-accent-400 transition-transform group-hover:scale-110" aria-hidden="true" />
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Contact */}
        <div className="lg:col-span-3">
          <Heading>Contact</Heading>
          <ul className="mt-6 space-y-4">
            {settings.phone && (
              <li>
                <a href={telHref(settings.phone)} className={cn('flex items-center gap-3', linkCls)}>
                  <Phone className="size-[18px] shrink-0 text-accent-400" aria-hidden="true" />
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className={cn('flex items-center gap-3 break-all', linkCls)}>
                  <Mail className="size-[18px] shrink-0 text-accent-400" aria-hidden="true" />
                  {settings.email}
                </a>
              </li>
            )}
            {address && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-[18px] shrink-0 text-accent-400" aria-hidden="true" />
                <div>
                  <address className="leading-relaxed not-italic">{address}</address>
                  {directions && (
                    <a
                      href={directions}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-300 hover:text-accent-200"
                    >
                      <Navigation className="size-3.5" aria-hidden="true" /> Get directions
                    </a>
                  )}
                </div>
              </li>
            )}
          </ul>
        </div>

        {/* Hours */}
        {hours.length > 0 && (
          <div className="lg:col-span-3">
            <Heading
              extra={
                status && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold',
                      status.open ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/10 text-navy-200',
                    )}
                  >
                    <span className={cn('size-1.5 rounded-full', status.open ? 'animate-pulse bg-emerald-400' : 'bg-navy-400')} aria-hidden="true" />
                    {status.open ? 'Open now' : 'Closed'}
                  </span>
                )
              }
            >
              Hours
            </Heading>
            <dl className="mt-6 space-y-3.5">
              {hours.map((h) => {
                const isToday = status?.today != null && rowCoversDay(h, status.today);
                return (
                  <div key={h.days} className="flex gap-3">
                    <Clock className={cn('mt-0.5 size-[18px] shrink-0', isToday ? 'text-accent-300' : 'text-accent-400/70')} aria-hidden="true" />
                    <div>
                      <dt className={cn('text-sm', isToday ? 'font-semibold text-accent-300' : 'text-navy-400')}>
                        {h.days}
                        {isToday && <span className="sr-only"> (today)</span>}
                      </dt>
                      <dd className={cn('mt-0.5', isToday ? 'font-semibold text-white' : 'text-navy-200')}>{h.hours}</dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </div>
        )}
      </div>

      {/* Service areas */}
      {settings.serviceAreas?.length > 0 && (
        <div className="container-page">
          <div className="flex flex-col gap-3 border-t border-white/10 py-7 sm:flex-row sm:items-baseline sm:gap-6">
            <p className="flex shrink-0 items-center gap-2 text-[13px] font-bold tracking-[0.14em] text-white uppercase">
              <MapPin className="anim-pin size-4 text-accent-400" aria-hidden="true" />
              Areas we serve
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 leading-relaxed text-navy-300">
              {settings.serviceAreas.map((a, i) => (
                <li
                  key={a}
                  className="group inline-flex cursor-default items-center gap-1.5 whitespace-nowrap transition-colors hover:text-white"
                  style={{ '--i': i }}
                >
                  <MapPin className="anim-pin size-4 shrink-0 text-accent-400" aria-hidden="true" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-4 py-6 pr-20 text-sm text-navy-400 sm:flex-row sm:items-center sm:justify-between sm:pr-24">
          <p>
            © {new Date().getFullYear()} {settings.businessName}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group inline-flex w-fit items-center gap-2 font-semibold text-navy-200 hover:text-white"
          >
            Back to top
            <ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
