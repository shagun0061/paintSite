import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

/**
 * Reads the business's rating and most relevant reviews from the official
 * Google Places API (New) — Place Details with a field mask. This is a
 * read-only, server-side call: the API key never reaches the browser, and
 * nothing is ever written to Google on anyone's behalf.
 *
 * Google limits Place Details to the five most relevant reviews and requires
 * attribution when they're displayed; the frontend renders author links and
 * a "Reviews from Google" label. Results are cached briefly in memory to
 * limit API usage — check the current Google Maps Platform terms for caching
 * rules before increasing CACHE_MS.
 */
const CACHE_MS = 30 * 60 * 1000;
const FIELD_MASK = 'displayName,rating,userRatingCount,reviews,googleMapsUri';

let cache = { data: null, expires: 0 };

export function resetGoogleReviewsCache() {
  cache = { data: null, expires: 0 };
}

function mapReview(r) {
  return {
    rating: r.rating ?? null,
    text: r.text?.text ?? r.originalText?.text ?? '',
    relativeTime: r.relativePublishTimeDescription ?? '',
    publishTime: r.publishTime ?? null,
    author: {
      name: r.authorAttribution?.displayName ?? 'Google user',
      uri: r.authorAttribution?.uri ?? null,
      photoUri: r.authorAttribution?.photoUri ?? null,
    },
    googleMapsUri: r.googleMapsUri ?? null,
  };
}

export async function getGoogleReviews() {
  if (!env.googlePlacesEnabled) return { enabled: false };
  if (cache.data && Date.now() < cache.expires) return cache.data;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(env.GOOGLE_PLACE_ID)}`, {
      headers: { 'X-Goog-Api-Key': env.GOOGLE_PLACES_API_KEY, 'X-Goog-FieldMask': FIELD_MASK },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      logger.warn(`Google Places API responded ${res.status}: ${(await res.text()).slice(0, 300)}`);
      return { enabled: true, available: false };
    }
    const json = await res.json();
    const data = {
      enabled: true,
      available: true,
      rating: json.rating ?? null,
      userRatingCount: json.userRatingCount ?? null,
      googleMapsUri: json.googleMapsUri ?? null,
      reviews: (json.reviews || []).map(mapReview),
    };
    cache = { data, expires: Date.now() + CACHE_MS };
    return data;
  } catch (err) {
    logger.warn(`Google Places API request failed: ${err.message}`);
    return { enabled: true, available: false };
  }
}
