/**
 * Central frontend configuration. Business details shown on the site come
 * from the API (Admin → Settings); the values here are fallbacks so the page
 * still renders — and WhatsApp/phone still work — before settings load.
 */
const env = import.meta.env;

export const SITE_URL = (env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');

export const fallbackSettings = {
  businessName: env.VITE_BUSINESS_NAME || 'Your Painting Company',
  tagline: 'Professional residential & commercial painters',
  phone: env.VITE_PHONE || '',
  email: '',
  whatsappNumber: env.VITE_WHATSAPP_NUMBER || '',
  whatsappDefaultMessage:
    'Hello, I found your painting website and would like to enquire about your services. Please share more details.',
  address: {},
  geo: {},
  serviceAreas: [],
  workingHours: [],
  googleMapsUrl: '',
  googleReviewUrl: '',
  googleMapsEmbedUrl: '',
  social: {},
  stats: {},
};

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Our Work' },
  { to: '/about', label: 'About' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/contact', label: 'Contact' },
];

export const PROJECT_CATEGORIES = ['Interior', 'Exterior', 'Commercial', 'Decorative'];
export const ENQUIRY_STATUSES = ['New', 'Contacted', 'In Progress', 'Completed'];
export const PROPERTY_TYPES = ['House', 'Apartment', 'Villa', 'Office', 'Shop / Retail', 'Other'];
export const SERVICE_ICONS = ['PaintRoller', 'Home', 'Building2', 'Palette', 'ShieldCheck', 'Hammer', 'Brush', 'PaintBucket'];

// Used when the services API is unavailable so the enquiry form still works.
export const FALLBACK_SERVICE_NAMES = [
  'Interior House Painting',
  'Exterior House Painting',
  'Commercial Painting',
  'Wall Texture & Decorative Painting',
  'Waterproofing & Wall Repairs',
  'Wood Polishing & Finishing',
];

const unsplash = (id, alt) => {
  const src = (w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;
  return { url: src(1600), alt, variants: [640, 1024, 1600, 2200].map((width) => ({ width, url: src(width) })) };
};

/** Brand imagery for static sections. Replace with the owner's own photos. */
export const SITE_IMAGES = {
  hero: unsplash('1615873968403-89e068629265', 'Living room freshly painted with a deep teal feature wall'),
  aboutTeam: unsplash('1595814433015-e6f5ce69614e', 'Painters at work with brushes and drop sheets'),
  aboutDetail: unsplash('1599619585752-c3edb42a414c', 'Paint tray and roller ready for a fresh coat'),
  colour: unsplash('1525909002-1b05e0c869d8', 'Colourful paint stripes applied with rollers'),
  contact: unsplash('1562259949-e8e7689d7828', 'Roller applying blue paint to a wall'),
};
