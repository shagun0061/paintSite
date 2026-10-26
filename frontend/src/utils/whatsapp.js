/**
 * WhatsApp Click-to-Chat (https://faq.whatsapp.com/5913398998672934).
 * wa.me opens the WhatsApp app on mobile and WhatsApp Web / Desktop on
 * computers. The message is only pre-filled — the customer chooses whether
 * to send it; nothing is sent automatically.
 */
export const normalizeWhatsAppNumber = (number) => String(number || '').replace(/\D/g, '');

export function buildWhatsAppUrl(number, message) {
  const digits = normalizeWhatsAppNumber(number);
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

export const whatsappMessages = {
  service: (serviceName) =>
    `Hello, I found your painting website and would like a free quote for ${serviceName}. Please share more details.`,
  project: (projectTitle) =>
    `Hello, I saw the "${projectTitle}" project on your website and would like a quote for similar work. Please share more details.`,
  quote: () => 'Hello, I would like to request a free painting quote. Please share more details.',
};
