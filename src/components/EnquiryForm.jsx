import { Mail, Phone, Send } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { PROPERTY_TYPES } from '../config/site.js';
import { useSettings } from '../context/SettingsContext.jsx';
import { SERVICES } from '../data/services.js';
import { cn } from '../utils/cn.js';
import { telHref } from '../utils/format.js';
import { validateEnquiry } from '../utils/validation.js';
import { buildWhatsAppUrl } from '../utils/whatsapp.js';
import { Button } from './ui/Button.jsx';
import { Field, fieldProps } from './ui/Field.jsx';
import { WhatsAppIcon } from './ui/Icons.jsx';
import { Alert } from './ui/States.jsx';

const START_OPTIONS = ['As soon as possible', 'Within 2 weeks', 'Within a month', 'In 1–3 months', 'Just planning'];

const TYPES = [
  { value: 'quote', label: 'Free quote' },
  { value: 'contact', label: 'General enquiry' },
];

const emptyForm = (type, service) => ({
  type,
  name: '',
  phone: '',
  email: '',
  service: service || '',
  location: '',
  propertyType: '',
  preferredStart: '',
  message: '',
});

/** Turns the form into a readable message for WhatsApp or email. */
function composeMessage(v) {
  const greeting =
    v.type === 'quote' ? 'Hello, I would like a free painting quote.' : 'Hello, I have an enquiry about your painting services.';
  const details = [
    `Name: ${v.name.trim()}`,
    `Phone: ${v.phone.trim()}`,
    v.email.trim() && `Email: ${v.email.trim()}`,
    `Service: ${v.service}`,
    `Location: ${v.location.trim()}`,
    v.propertyType && `Property type: ${v.propertyType}`,
    v.preferredStart && `Preferred start: ${v.preferredStart}`,
  ].filter(Boolean);
  return [greeting, details.join('\n'), v.message.trim()].filter(Boolean).join('\n\n');
}

/**
 * Enquiry / quote form. There is no server: on submit it opens WhatsApp (or
 * the visitor's email app) with their details pre-filled, and the visitor
 * presses Send. Nothing is sent automatically.
 */
export function EnquiryForm({ defaultType = 'quote', defaultService = '' }) {
  const uid = useId();
  const { settings } = useSettings();
  const [values, setValues] = useState(() => emptyForm(defaultType, defaultService));
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(null); // { whatsapp, email } links after submit

  // Follow ?type= / ?service= changes when the user clicks another "Get a quote" link.
  useEffect(() => {
    setValues((v) => ({ ...v, type: defaultType, service: defaultService || v.service }));
  }, [defaultType, defaultService]);

  const id = (name) => `${uid}-${name}`;
  const set = (name) => (e) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }));
  };

  function onSubmit(e) {
    e.preventDefault();
    const errs = validateEnquiry(values);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(id(first))?.focus();
      return;
    }
    const text = composeMessage(values);
    const subject = values.type === 'quote' ? `Quote request – ${values.service}` : `Enquiry – ${values.service}`;
    const links = {
      whatsapp: buildWhatsAppUrl(settings.whatsappNumber, text),
      email: settings.email ? `mailto:${settings.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}` : null,
    };
    if (links.whatsapp) window.open(links.whatsapp, '_blank', 'noopener');
    else if (links.email) window.location.href = links.email;
    setSent(links);
  }

  const isQuote = values.type === 'quote';
  const hasChannel = Boolean(buildWhatsAppUrl(settings.whatsappNumber) || settings.email);

  if (sent) {
    return (
      <div className="space-y-5">
        <Alert tone="success" title={sent.whatsapp ? 'Almost done — press Send in WhatsApp' : 'Almost done — press Send in your email app'}>
          <p>
            We've opened {sent.whatsapp ? 'WhatsApp' : 'your email app'} with your details filled in. Your message reaches us once you
            press Send there.
          </p>
        </Alert>
        <div className="flex flex-wrap gap-3">
          {sent.whatsapp && (
            <Button href={sent.whatsapp} external variant="whatsapp" icon={WhatsAppIcon}>
              Open WhatsApp again
            </Button>
          )}
          {sent.email && (
            <Button href={sent.email} variant="outline" icon={Mail}>
              {sent.whatsapp ? 'Send by email instead' : 'Open email again'}
            </Button>
          )}
          <Button variant="ghost" onClick={() => setSent(null)}>
            Edit details
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <fieldset>
        <legend className="sr-only">Enquiry type</legend>
        <div className="inline-flex rounded-full bg-navy-50 p-1">
          {TYPES.map((t) => (
            <label
              key={t.value}
              className={cn(
                'cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors has-focus-visible:outline-2 has-focus-visible:outline-accent-500',
                values.type === t.value ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-600 hover:text-navy-900',
              )}
            >
              <input type="radio" name={`${uid}-type`} value={t.value} checked={values.type === t.value} onChange={set('type')} className="sr-only" />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={id('name')} label="Full name" required error={errors.name}>
          <input {...fieldProps(id('name'), errors.name)} autoComplete="name" value={values.name} onChange={set('name')} />
        </Field>
        <Field id={id('phone')} label="Phone number" required error={errors.phone}>
          <input {...fieldProps(id('phone'), errors.phone)} type="tel" autoComplete="tel" inputMode="tel" value={values.phone} onChange={set('phone')} />
        </Field>
        <Field id={id('email')} label="Email" optional error={errors.email}>
          <input {...fieldProps(id('email'), errors.email)} type="email" autoComplete="email" value={values.email} onChange={set('email')} />
        </Field>
        <Field id={id('location')} label="Location / area" required error={errors.location} hint="Suburb or neighbourhood is fine">
          <input
            {...fieldProps(id('location'), errors.location, { hint: true })}
            autoComplete="address-level2"
            value={values.location}
            onChange={set('location')}
          />
        </Field>
        <Field id={id('service')} label="Service required" required error={errors.service} className={isQuote ? '' : 'sm:col-span-2'}>
          <select {...fieldProps(id('service'), errors.service)} value={values.service} onChange={set('service')}>
            <option value="">Choose a service…</option>
            {[...new Set([...SERVICES.map((s) => s.title), ...(values.service ? [values.service] : [])])].map((s) => (
              <option key={s}>{s}</option>
            ))}
            <option>Other / not sure</option>
          </select>
        </Field>
        {isQuote && (
          <Field id={id('propertyType')} label="Property type" optional>
            <select {...fieldProps(id('propertyType'))} value={values.propertyType} onChange={set('propertyType')}>
              <option value="">Select…</option>
              {PROPERTY_TYPES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>
        )}
        {isQuote && (
          <Field id={id('preferredStart')} label="When would you like to start?" optional className="sm:col-span-2">
            <select {...fieldProps(id('preferredStart'))} value={values.preferredStart} onChange={set('preferredStart')}>
              <option value="">Select…</option>
              {START_OPTIONS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>
        )}
        <Field
          id={id('message')}
          label={isQuote ? 'Project details' : 'Message'}
          optional
          error={errors.message}
          hint={isQuote ? 'Rooms or areas, approximate size, colours you have in mind…' : undefined}
          className="sm:col-span-2"
        >
          <textarea
            {...fieldProps(id('message'), errors.message, { hint: isQuote })}
            rows={5}
            maxLength={2000}
            value={values.message}
            onChange={set('message')}
          />
        </Field>
      </div>

      {hasChannel ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-navy-500">
            {buildWhatsAppUrl(settings.whatsappNumber)
              ? 'This opens WhatsApp with your details filled in — just press Send.'
              : 'This opens your email app with your details filled in — just press Send.'}
          </p>
          <Button type="submit" size="lg" icon={buildWhatsAppUrl(settings.whatsappNumber) ? WhatsAppIcon : Send}>
            {isQuote ? 'Request free quote' : 'Send message'}
          </Button>
        </div>
      ) : (
        settings.phone && (
          <Alert tone="info">
            Please call us on{' '}
            <a href={telHref(settings.phone)} className="font-semibold underline">
              {settings.phone}
            </a>{' '}
            to discuss your project.
          </Alert>
        )
      )}
      {buildWhatsAppUrl(settings.whatsappNumber) && settings.phone && (
        <p className="flex items-center gap-1.5 text-sm text-navy-600">
          <Phone className="size-4" aria-hidden="true" /> No WhatsApp? Call us on{' '}
          <a href={telHref(settings.phone)} className="font-semibold text-accent-600 hover:underline">
            {settings.phone}
          </a>
          {settings.email && (
            <>
              {' '}
              or email{' '}
              <a href={`mailto:${settings.email}`} className="font-semibold text-accent-600 hover:underline">
                {settings.email}
              </a>
            </>
          )}
          .
        </p>
      )}
    </form>
  );
}
