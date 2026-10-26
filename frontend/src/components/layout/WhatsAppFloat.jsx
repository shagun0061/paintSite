import { Phone } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext.jsx';
import { useWhatsApp } from '../../hooks/useWhatsApp.js';
import { telHref } from '../../utils/format.js';
import { WhatsAppIcon } from '../ui/Icons.jsx';

/** Floating contact button on every public page; falls back to a call button without a WhatsApp number. */
export function WhatsAppFloat() {
  const { settings } = useSettings();
  const link = useWhatsApp()();
  const base =
    'group fixed right-4 bottom-4 z-40 flex items-center rounded-full p-3.5 text-white shadow-lift transition-transform hover:scale-105 sm:right-6 sm:bottom-6 print:hidden';

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className={`${base} bg-whatsapp-dark hover:bg-whatsapp-darker`}>
        <WhatsAppIcon className="size-7" />
        <span className="sr-only sm:not-sr-only sm:max-w-0 sm:overflow-hidden sm:font-semibold sm:whitespace-nowrap sm:transition-[max-width] sm:duration-300 sm:group-hover:ml-2.5 sm:group-hover:max-w-40 sm:group-focus-visible:ml-2.5 sm:group-focus-visible:max-w-40">
          Chat on WhatsApp
        </span>
      </a>
    );
  }
  if (settings.phone) {
    return (
      <a href={telHref(settings.phone)} className={`${base} bg-accent-600 hover:bg-accent-700`}>
        <Phone className="size-6" aria-hidden="true" />
        <span className="sr-only">Call {settings.phone}</span>
      </a>
    );
  }
  return null;
}
