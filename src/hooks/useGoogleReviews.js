import { useEffect, useState } from 'react';
import { useSettings } from '../context/SettingsContext.jsx';
import { GOOGLE_MAPS_API_KEY, importGoogleLibrary } from '../utils/googleMaps.js';

// One request per page load, shared by every component that shows reviews.
let cached;

async function fetchReviews({ placeId, query }) {
  const { Place } = await importGoogleLibrary('places');

  let place;
  if (placeId) {
    place = new Place({ id: placeId });
  } else {
    const { places } = await Place.searchByText({ textQuery: query, fields: ['id'], maxResultCount: 1 });
    place = places?.[0];
    if (!place) throw new Error(`No Google place found for "${query}"`);
    if (import.meta.env.DEV) {
      console.info(`[Google reviews] Found Place ID "${place.id}". Put it in googlePlaceId in src/data/business.js to skip this search.`);
    }
  }

  await place.fetchFields({ fields: ['displayName', 'rating', 'userRatingCount', 'reviews', 'googleMapsURI'] });

  return {
    name: place.displayName,
    rating: place.rating ?? null,
    total: place.userRatingCount ?? 0,
    url: place.googleMapsURI,
    reviews: (place.reviews || [])
      .filter((r) => r.text)
      .map((r) => ({
        author: r.authorAttribution?.displayName || 'Google user',
        authorUrl: r.authorAttribution?.uri || null,
        photo: r.authorAttribution?.photoURI || null,
        rating: r.rating,
        text: r.text,
        when: r.relativePublishTimeDescription,
        url: r.googleMapsURI || place.googleMapsURI,
      })),
  };
}

/**
 * Live rating and reviews from the Google Business Profile.
 * status: 'disabled' (no API key / place configured) | 'loading' | 'ready' | 'error'
 * Google returns at most 5 reviews, chosen by relevance.
 */
export function useGoogleReviews() {
  const { settings } = useSettings();
  const placeId = settings.googlePlaceId;
  const query = settings.googlePlaceSearch;
  const enabled = Boolean(GOOGLE_MAPS_API_KEY && (placeId || query));

  const [state, setState] = useState(() => (enabled ? { status: 'loading' } : { status: 'disabled' }));

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    cached ??= fetchReviews({ placeId, query }).catch((error) => {
      cached = undefined;
      throw error;
    });
    cached.then(
      (data) => active && setState({ status: 'ready', data }),
      (error) => {
        if (import.meta.env.DEV) console.warn('[Google reviews]', error);
        if (active) setState({ status: 'error' });
      },
    );
    return () => {
      active = false;
    };
  }, [enabled, placeId, query]);

  return state;
}
