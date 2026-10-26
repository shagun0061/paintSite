/**
 * Your business details — used across the whole site (header, footer, contact
 * page, WhatsApp buttons, Google links and search-engine structured data).
 *
 * ⚠️ PLACEHOLDERS: replace every value below with your real details before
 * sharing the site. Leave a field empty ('') to hide it.
 */
export const BUSINESS = {
  businessName: 'Brush & Beam Painting Co.',
  tagline: 'Professional residential & commercial painters',
  logoUrl: '', // e.g. '/images/logo.svg' (file in frontend/public/images). Empty = built-in mark.

  phone: '+61 403 301 342',
  email: 'hello@example.com',

  // International format, digits only: country code + number, no +, spaces or dashes.
  whatsappNumber: '61403301342',
  whatsappDefaultMessage:
    'Hello, I found your painting website and would like to enquire about your services. Please share more details.',

  address: {
    street: '123 Example Street',
    city: 'Your City',
    region: 'Your State',
    postalCode: '00000',
    country: 'US',
  },
  geo: { lat: null, lng: null }, // optional, improves local SEO

  serviceAreas: ['Your City', 'North Suburbs', 'Downtown', 'East Side'],
  workingHours: [
    { days: 'Monday – Friday', hours: '8:00 AM – 6:00 PM' },
    { days: 'Saturday', hours: '9:00 AM – 2:00 PM' },
    { days: 'Sunday', hours: 'Closed' },
  ],

  // From your Google Business Profile: "Share" link and "Ask for reviews" link.
  googleMapsUrl: '',
  googleReviewUrl: '',
  // Optional: Google Maps → Share → Embed a map → copy only the src="…" URL.
  googleMapsEmbedUrl: '',

  social: { facebook: '', instagram: '', youtube: '' },

  // Shown on the About page only when filled in. Use accurate numbers.
  stats: { yearsExperience: 12, projectsCompleted: 450, teamSize: 8 },
};
