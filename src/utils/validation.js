const PHONE = /^\+?[0-9][0-9\s\-().]{6,22}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEnquiry(v) {
  const e = {};
  if (!v.name?.trim() || v.name.trim().length < 2) e.name = 'Please enter your name';
  if (!PHONE.test(v.phone?.trim() || '')) e.phone = 'Enter a valid phone number';
  if (v.email?.trim() && !EMAIL.test(v.email.trim())) e.email = 'Enter a valid email';
  if (!v.service) e.service = 'Please choose a service';
  if (!v.location?.trim() || v.location.trim().length < 2) e.location = 'Please enter your location';
  if ((v.message || '').length > 2000) e.message = 'Please keep your message under 2000 characters';
  return e;
}
