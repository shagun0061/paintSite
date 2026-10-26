import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { SITE_IMAGES, SITE_URL } from '../../config/site.js';
import { useSettings } from '../../context/SettingsContext.jsx';

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!content) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Per-page <title>, description, canonical URL and Open Graph / Twitter tags.
 * Updates the tags already in index.html so nothing is duplicated.
 */
export function Seo({ title, description, image, noindex = false, type = 'website' }) {
  const { settings } = useSettings();
  const { pathname } = useLocation();

  useEffect(() => {
    const name = settings.businessName;
    const fullTitle = title ? `${title} | ${name}` : `${name} | Professional Painting Services`;
    const url = `${SITE_URL}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}`;
    const img = image || SITE_IMAGES.hero.variants.find((v) => v.width >= 1024)?.url;

    document.title = fullTitle;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : null);
    upsertCanonical(url);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:site_name', name);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', img);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', img);
  }, [title, description, image, noindex, type, pathname, settings.businessName]);

  return null;
}

/** Injects a JSON-LD <script> into <head> for the lifetime of the component. */
export function JsonLd({ id, data }) {
  const json = data ? JSON.stringify(data) : '';
  useEffect(() => {
    if (!json) return undefined;
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    el.textContent = json;
    document.head.appendChild(el);
    return () => el.remove();
  }, [id, json]);
  return null;
}
