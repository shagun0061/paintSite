import { unsplash } from '../data/images.js';

/** Public site URL for canonical and social-sharing links. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Our Work' },
  { to: '/about', label: 'About' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/contact', label: 'Contact' },
];

export const PROJECT_CATEGORIES = ['Interior', 'Exterior', 'Commercial', 'Decorative'];
export const PROPERTY_TYPES = ['House', 'Apartment', 'Villa', 'Office', 'Shop / Retail', 'Other'];

/** Brand imagery for static sections. Replace with the owner's own photos. */
export const SITE_IMAGES = {
  hero: unsplash('1615873968403-89e068629265', 'Living room freshly painted with a deep teal feature wall'),
  aboutTeam: unsplash('1595814433015-e6f5ce69614e', 'Painters at work with brushes and drop sheets'),
  aboutDetail: unsplash('1599619585752-c3edb42a414c', 'Paint tray and roller ready for a fresh coat'),
  colour: unsplash('1525909002-1b05e0c869d8', 'Colourful paint stripes applied with rollers'),
  contact: unsplash('1562259949-e8e7689d7828', 'Roller applying blue paint to a wall'),
};
