// Mirrors the backend zod rules so users get instant feedback; the server re-validates everything.
const PHONE = /^\+?[0-9][0-9\s\-().]{6,22}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEnquiry(v) {
  const e = {};
  if (!v.name?.trim() || v.name.trim().length < 2) e.name = 'Please enter your name';
  if (!PHONE.test(v.phone?.trim() || '')) e.phone = 'Enter a valid phone number';
  if (v.email?.trim() && !EMAIL.test(v.email.trim())) e.email = 'Enter a valid email';
  if (!v.service) e.service = 'Please choose a service';
  if (!v.location?.trim() || v.location.trim().length < 2) e.location = 'Please enter your location';
  if (v.type === 'contact' && !v.message?.trim()) e.message = 'Please tell us a little about your project';
  if ((v.message || '').length > 2000) e.message = 'Please keep your message under 2000 characters';
  return e;
}

export function validateReview(v) {
  const e = {};
  if (!v.name?.trim() || v.name.trim().length < 2) e.name = 'Please enter your name';
  if (!(v.rating >= 1 && v.rating <= 5)) e.rating = 'Please choose a rating';
  if (!v.text?.trim() || v.text.trim().length < 10) e.text = 'Please write at least 10 characters';
  if ((v.text || '').length > 1500) e.text = 'Please keep your review under 1500 characters';
  return e;
}
