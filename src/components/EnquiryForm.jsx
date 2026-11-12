import { Info, Mail } from 'lucide-react';
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
  { value: 'quote', label: 'A free quote', hint: 'For a new painting job' },
  { value: 'contact', label: 'Ask a question', hint: 'Anything else' },
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
    const channel = e.nativeEvent?.submitter?.value === 'email' ? 'email' : 'whatsapp';
    const text = composeMessage(values);
    const subject = values.type === 'quote' ? `Quote request – ${values.service}` : `Enquiry – ${values.service}`;
    const links = {
      whatsapp: buildWhatsAppUrl(settings.whatsappNumber, text),
      email: settings.email ? `mailto:${settings.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}` : null,
    };
    if (channel === 'whatsapp' && links.whatsapp) window.open(links.whatsapp, '_blank', 'noopener');
    else if (links.email) window.location.href = links.email;
    else if (links.whatsapp) window.open(links.whatsapp, '_blank', 'noopener');
    setSent({ ...links, used: channel === 'email' && links.email ? 'email' : links.whatsapp ? 'whatsapp' : 'email' });
  }

  const isQuote = values.type === 'quote';
  const hasChannel = Boolean(buildWhatsAppUrl(settings.whatsappNumber) || settings.email);

  if (sent) {
    return (
      <div className="space-y-5">
        <Alert tone="success" title={sent.used === 'whatsapp' ? 'Almost done — press Send in WhatsApp' : 'Almost done — press Send in your email app'}>
          <p>
            We've opened {sent.used === 'whatsapp' ? 'WhatsApp' : 'your email app'} with your details filled in. Your message reaches us
            once you press Send there.
          </p>
        </Alert>
        <div className="flex flex-wrap gap-3">
          {sent.whatsapp && (
            <Button href={sent.whatsapp} external variant="whatsapp" icon={WhatsAppIcon}>
              {sent.used === 'whatsapp' ? 'Open WhatsApp again' : 'Send via WhatsApp instead'}
            </Button>
          )}
          {sent.email && (
            <Button href={sent.email} variant="outline" icon={Mail}>
              {sent.used === 'email' ? 'Open email again' : 'Send by email instead'}
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
        <legend className="mb-2.5 text-sm font-semibold text-navy-900">What do you need?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {TYPES.map((t) => {
            const active = values.type === t.value;
            return (
              <label
                key={t.value}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3.5 transition has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-500',
                  active ? 'border-accent-600 bg-accent-50' : 'border-navy-100 hover:border-navy-200 hover:bg-navy-50/50',
                )}
              >
                <input type="radio" name={`${uid}-type`} value={t.value} checked={active} onChange={set('type')} className="sr-only" />
                <span
                  className={cn(
                    'inline-flex size-5 shrink-0 items-center justify-center rounded-full border-2',
                    active ? 'border-accent-600' : 'border-navy-300',
                  )}
                  aria-hidden="true"
                >
                  {active && <span className="size-2.5 rounded-full bg-accent-600" />}
                </span>
                <span>
                  <span className="block font-semibold text-navy-900">{t.label}</span>
                  <span className="block text-sm text-navy-500">{t.hint}</span>
                </span>
              </label>
            );
          })}
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
        <div className="rounded-2xl bg-beige-50 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            {buildWhatsAppUrl(settings.whatsappNumber) && (
              <Button type="submit" value="whatsapp" variant="whatsapp" size="lg" icon={WhatsAppIcon} className="sm:flex-1">
                Send via WhatsApp
              </Button>
            )}
            {settings.email && (
              <Button
                type="submit"
                value="email"
                variant={buildWhatsAppUrl(settings.whatsappNumber) ? 'outline' : 'primary'}
                size="lg"
                icon={Mail}
                className="sm:flex-1"
              >
                Send by email
              </Button>
            )}
          </div>
          <p className="mt-3 flex items-start gap-2 text-sm text-navy-600">
            <Info className="mt-0.5 size-4 shrink-0 text-navy-400" aria-hidden="true" />
            Your message opens in WhatsApp or your email app with everything filled in. Just press Send there.
          </p>
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
    </form>
  );
}
