import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { Link } from 'react-router';
import { NAV_LINKS } from '../../config/site.js';
import { useSettings } from '../../context/SettingsContext.jsx';
import { formatAddress, telHref } from '../../utils/format.js';
import { Logo } from './Logo.jsx';

const SOCIAL = [
  { key: 'facebook', label: 'Facebook', Icon: Facebook },
  { key: 'instagram', label: 'Instagram', Icon: Instagram },
  { key: 'youtube', label: 'YouTube', Icon: Youtube },
];

export function Footer() {
  const { settings } = useSettings();
  const address = formatAddress(settings.address);
  const socials = SOCIAL.filter((s) => settings.social?.[s.key]);

  return (
    <footer className="bg-navy-950 text-navy-200">
      <div className="container-page grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo light />
          <p className="mt-5 max-w-sm leading-relaxed">{settings.tagline}</p>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-2">
              {socials.map(({ key, label, Icon }) => (
                <li key={key}>
                  <a
                    href={settings.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-10 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-accent-600"
                  >
                    <Icon className="size-5" aria-hidden="true" />
                    <span className="sr-only">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Footer" className="lg:col-span-2">
          <h2 className="font-sans text-sm font-bold tracking-wider text-white uppercase">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="font-sans text-sm font-bold tracking-wider text-white uppercase">Get in touch</h2>
          <ul className="mt-4 space-y-3">
            {settings.phone && (
              <li>
                <a href={telHref(settings.phone)} className="flex gap-3 hover:text-white">
                  <Phone className="mt-0.5 size-4 shrink-0 text-accent-400" aria-hidden="true" />
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="flex gap-3 break-all hover:text-white">
                  <Mail className="mt-0.5 size-4 shrink-0 text-accent-400" aria-hidden="true" />
                  {settings.email}
                </a>
              </li>
            )}
            {address && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent-400" aria-hidden="true" />
                <address className="not-italic">{address}</address>
              </li>
            )}
            {settings.workingHours?.map((h) => (
              <li key={h.days} className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-accent-400" aria-hidden="true" />
                <span>
                  {h.days}: <span className="text-white">{h.hours}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {settings.serviceAreas?.length > 0 && (
          <div className="lg:col-span-3">
            <h2 className="font-sans text-sm font-bold tracking-wider text-white uppercase">Areas we serve</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {settings.serviceAreas.map((area) => (
                <li key={area} className="rounded-full border border-white/10 px-3 py-1 text-sm">
                  {area}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-6 text-sm">
          <p>
            © {new Date().getFullYear()} {settings.businessName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
