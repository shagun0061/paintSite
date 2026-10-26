/**
 * PLACEHOLDER business details used until the owner fills in the real ones
 * from Admin → Settings. Nothing here describes a real business.
 * Google links are intentionally empty: never point them at a profile
 * that isn't the owner's own.
 */
export const defaultSettings = {
  businessName: 'Brush & Beam Painting Co.',
  tagline: 'Professional residential & commercial painters',
  logoUrl: '',
  phone: '+1 555 000 1234',
  email: 'hello@example.com',
  whatsappNumber: '15550001234',
  whatsappDefaultMessage:
    'Hello, I found your painting website and would like to enquire about your services. Please share more details.',
  address: {
    street: '123 Example Street',
    city: 'Your City',
    region: 'Your State',
    postalCode: '00000',
    country: 'US',
  },
  geo: { lat: null, lng: null },
  serviceAreas: ['Your City', 'North Suburbs', 'Downtown', 'East Side'],
  workingHours: [
    { days: 'Monday – Friday', hours: '8:00 AM – 6:00 PM' },
    { days: 'Saturday', hours: '9:00 AM – 2:00 PM' },
    { days: 'Sunday', hours: 'Closed' },
  ],
  googleMapsUrl: '',
  googleReviewUrl: '',
  googleMapsEmbedUrl: '',
  social: { facebook: '', instagram: '', youtube: '' },
  stats: { yearsExperience: 12, projectsCompleted: 450, teamSize: 8 },
};
