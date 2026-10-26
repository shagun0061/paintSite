import { Clock, MapPin, Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { NAV_LINKS } from '../../config/site.js';
import { useSettings } from '../../context/SettingsContext.jsx';
import { useWhatsApp } from '../../hooks/useWhatsApp.js';
import { cn } from '../../utils/cn.js';
import { telHref } from '../../utils/format.js';
import { Button } from '../ui/Button.jsx';
import { WhatsAppIcon } from '../ui/Icons.jsx';
import { Logo } from './Logo.jsx';

function TopBar() {
  const { settings } = useSettings();
  const hours = settings.workingHours?.[0];
  return (
    <div className="hidden bg-navy-950 text-sm text-navy-100 md:block">
      <div className="container-page flex h-10 items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          {hours && (
            <span className="flex items-center gap-2">
              <Clock className="size-4 text-accent-400" aria-hidden="true" />
              {hours.days}: {hours.hours}
            </span>
          )}
          {settings.serviceAreas?.length > 0 && (
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-accent-400" aria-hidden="true" />
              Serving {settings.serviceAreas.slice(0, 3).join(', ')}
              {settings.serviceAreas.length > 3 && ' & nearby'}
            </span>
          )}
        </div>
        {settings.phone && (
          <a href={telHref(settings.phone)} className="flex items-center gap-2 font-semibold text-white hover:text-accent-300">
            <Phone className="size-4 text-accent-400" aria-hidden="true" />
            {settings.phone}
          </a>
        )}
      </div>
    </div>
  );
}

export function Navbar() {
  const { settings } = useSettings();
  const whatsapp = useWhatsApp();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const linkClass = ({ isActive }) =>
    cn(
      'relative rounded-full px-3.5 py-2 text-[15px] font-semibold transition-colors',
      isActive ? 'text-navy-900 after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-accent-500' : 'text-navy-600 hover:text-navy-900',
    );

  const waLink = whatsapp();

  return (
    <>
      <a href="#main" className="sr-only z-[100] rounded-md bg-white px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <TopBar />
      <header
        className={cn(
          'sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md transition-shadow duration-300',
          scrolled ? 'border-navy-100 shadow-soft' : 'border-transparent',
        )}
      >
        <div className="container-page flex h-18 items-center justify-between gap-4">
          <Logo />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.to === '/'} className={linkClass}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {settings.phone && (
              <a
                href={telHref(settings.phone)}
                className="inline-flex size-11 items-center justify-center rounded-full text-navy-700 hover:bg-navy-50 md:hidden"
              >
                <Phone className="size-5" aria-hidden="true" />
                <span className="sr-only">Call {settings.phone}</span>
              </a>
            )}
            <Button to="/contact?type=quote#enquiry" className="hidden sm:inline-flex">
              Get a Free Quote
            </Button>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full text-navy-900 hover:bg-navy-50 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          hidden={!open}
          className="h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-navy-100 bg-white lg:hidden"
        >
          <nav aria-label="Mobile" className="container-page py-4">
            <ul className="divide-y divide-navy-100">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      cn('block py-4 text-lg font-semibold', isActive ? 'text-accent-600' : 'text-navy-900')
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3">
              <Button to="/contact?type=quote#enquiry" size="lg">
                Get a Free Quote
              </Button>
              {waLink && (
                <Button href={waLink} external variant="whatsapp" size="lg" icon={WhatsAppIcon}>
                  Chat on WhatsApp
                </Button>
              )}
              {settings.phone && (
                <Button href={telHref(settings.phone)} variant="outline" size="lg" icon={Phone}>
                  Call {settings.phone}
                </Button>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
