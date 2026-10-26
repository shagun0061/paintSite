import { SITE_IMAGES } from '../config/site.js';

/**
 * schema.org HousePainter (a LocalBusiness subtype) built only from the
 * owner's configured business details — empty fields are omitted. Website
 * testimonials are deliberately not included as aggregateRating (Google
 * ignores self-serving review markup on LocalBusiness).
 */
export function buildBusinessJsonLd(settings, siteUrl) {
  const a = settings.address || {};
  const data = {
    '@context': 'https://schema.org',
    '@type': 'HousePainter',
    '@id': `${siteUrl}/#business`,
    name: settings.businessName,
    description: settings.tagline || undefined,
    url: siteUrl,
    image: settings.logoUrl || SITE_IMAGES.hero.url,
    logo: settings.logoUrl || undefined,
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    address: a.street || a.city
      ? {
          '@type': 'PostalAddress',
          streetAddress: a.street || undefined,
          addressLocality: a.city || undefined,
          addressRegion: a.region || undefined,
          postalCode: a.postalCode || undefined,
          addressCountry: a.country || undefined,
        }
      : undefined,
    geo:
      settings.geo?.lat != null && settings.geo?.lng != null
        ? { '@type': 'GeoCoordinates', latitude: settings.geo.lat, longitude: settings.geo.lng }
        : undefined,
    areaServed: settings.serviceAreas?.length ? settings.serviceAreas.map((name) => ({ '@type': 'Place', name })) : undefined,
    hasMap: settings.googleMapsUrl || undefined,
    sameAs: [settings.googleMapsUrl, ...Object.values(settings.social || {})].filter(Boolean),
  };
  if (!data.sameAs.length) delete data.sameAs;
  return JSON.parse(JSON.stringify(data)); // drops undefined keys
}
