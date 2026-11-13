/**
 * Your business details — used across the whole site (header, footer, contact
 * page, WhatsApp buttons, Google links and search-engine structured data).
 *
 * ⚠️ PLACEHOLDERS: replace every value below with your real details before
 * sharing the site. Leave a field empty ('') to hide it.
 */
export const BUSINESS = {
  businessName: 'Anant Painting Services',
  tagline: 'Interior & exterior, domestic & commercial painting. Quality work at reasonable prices.',
  // Logo files in public/images/brand. logoUrl is used on light backgrounds (header),
  // logoUrlOnDark on dark backgrounds (footer). Empty = built-in mark + business name.
  logoUrl: '/images/brand/logo-dark.png',
  logoUrlOnDark: '/images/brand/logo.png',

  phone: '0403 301 342',
  email: 'anantpaintingservices@gmail.com',

  // International format, digits only: country code + number, no +, spaces or dashes.
  whatsappNumber: '61403301342',
  whatsappDefaultMessage:
    'Hello, I found your painting website and would like to enquire about your services. Please share more details.',

  address: {
    street: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
  },
  geo: { lat: null, lng: null }, // optional, improves local SEO

  serviceAreas: ['Mulgrave', 'Glen Waverley', 'Wheelers Hill', 'Clayton', 'Springvale', 'Noble Park', 'Dandenong', 'Rowville'],
  workingHours: [
    { days: 'Monday – Friday', hours: '7:00 am – 5:00 pm' },
    { days: 'Saturday', hours: '8:00 am – 1:00 pm (by appointment)' },
    { days: 'Sunday', hours: 'Closed' },
  ],

  // From your Google Business Profile: "Share" link and "Ask for reviews" link.
  googleMapsUrl: '',
  googleReviewUrl: '',
  // Optional: Google Maps → Share → Embed a map → copy only the src="…" URL.
  googleMapsEmbedUrl: '',

  social: { facebook: '', instagram: '', youtube: '' },

  // Shown on the About page only when filled in. Use accurate numbers.
  stats: { yearsExperience: null, projectsCompleted: null, teamSize: null },
};
