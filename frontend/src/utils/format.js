export function formatDate(value, options = { month: 'long', year: 'numeric' }) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat(undefined, options).format(date);
}

export const formatDateTime = (value) =>
  formatDate(value, { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });

export const telHref = (phone) => `tel:${String(phone || '').replace(/[^\d+]/g, '')}`;

export function formatAddress(address = {}, { multiline = false } = {}) {
  const line2 = [address.city, address.region, address.postalCode].filter(Boolean).join(', ');
  const parts = [address.street, line2, address.country].filter(Boolean);
  return multiline ? parts : parts.join(', ');
}

export const pluralize = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
