import { useCallback } from 'react';
import { useSettings } from '../context/SettingsContext.jsx';
import { buildWhatsAppUrl } from '../utils/whatsapp.js';

/** Returns `link(message?)` → wa.me URL for the configured number, or null if none is set. */
export function useWhatsApp() {
  const { settings } = useSettings();
  return useCallback(
    (message) => buildWhatsAppUrl(settings.whatsappNumber, message || settings.whatsappDefaultMessage),
    [settings.whatsappNumber, settings.whatsappDefaultMessage],
  );
}
