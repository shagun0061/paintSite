import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fallbackSettings } from '../config/site.js';
import { fetchSettings } from '../services/endpoints.js';

const SettingsContext = createContext({ settings: fallbackSettings, loaded: false, refresh: () => {} });

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(fallbackSettings);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async (opts) => {
    try {
      const { settings: remote } = await fetchSettings(opts);
      setSettings({ ...fallbackSettings, ...remote });
    } catch (err) {
      if (err.name === 'AbortError') return;
      // Keep fallbacks so phone/WhatsApp contact still works if the API is down.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    refresh({ signal: controller.signal });
    return () => controller.abort();
  }, [refresh]);

  const value = useMemo(() => ({ settings, loaded, refresh }), [settings, loaded, refresh]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
