/**
 * Loads the Google Maps JavaScript API once and returns a library from it.
 * The key comes from VITE_GOOGLE_MAPS_API_KEY (see .env.example).
 */
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

let loader;

function loadScript() {
  if (window.google?.maps?.importLibrary) return Promise.resolve();
  if (loader) return loader;

  loader = new Promise((resolve, reject) => {
    const callback = '__onGoogleMapsLoaded';
    window[callback] = () => {
      delete window[callback];
      resolve();
    };
    const params = new URLSearchParams({ key: GOOGLE_MAPS_API_KEY, v: 'weekly', loading: 'async', callback });
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
    script.async = true;
    script.onerror = () => {
      loader = undefined;
      script.remove();
      reject(new Error('Could not load Google Maps'));
    };
    document.head.appendChild(script);
  });
  return loader;
}

export async function importGoogleLibrary(name) {
  if (!GOOGLE_MAPS_API_KEY) throw new Error('VITE_GOOGLE_MAPS_API_KEY is not set');
  await loadScript();
  return window.google.maps.importLibrary(name);
}
