import { Send } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { FALLBACK_SERVICE_NAMES, PROPERTY_TYPES } from '../config/site.js';
import { useSettings } from '../context/SettingsContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { useWhatsApp } from '../hooks/useWhatsApp.js';
import { fetchServices, submitEnquiry } from '../services/endpoints.js';
import { cn } from '../utils/cn.js';
import { telHref } from '../utils/format.js';
import { validateEnquiry } from '../utils/validation.js';
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
  website: '', // honeypot
});

export function EnquiryForm({ defaultType = 'quote', defaultService = '' }) {
  const uid = useId();
  const formRef = useRef(null);
  const { settings } = useSettings();
  const whatsapp = useWhatsApp();
  const { data } = useAsync((o) => fetchServices(o), []);
  const serviceNames = data?.items?.length ? data.items.map((s) => s.title) : FALLBACK_SERVICE_NAMES;

  const [values, setValues] = useState(() => emptyForm(defaultType, defaultService));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle' });

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

  const focusFirstError = (errs) => {
    const first = Object.keys(errs)[0];
    if (first) requestAnimationFrame(() => document.getElementById(id(first))?.focus());
  };

  async function onSubmit(e) {
    e.preventDefault();
    const errs = validateEnquiry(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      focusFirstError(errs);
      return;
    }
    setStatus({ state: 'submitting' });
    try {
      const res = await submitEnquiry(values);
      setStatus({ state: 'success', message: res.message });
      setValues(emptyForm(values.type, ''));
      formRef.current?.scrollIntoView({ block: 'center' });
    } catch (err) {
      setErrors(err.details || {});
      focusFirstError(err.details || {});
      setStatus({ state: 'error', message: err.message });
    }
  }

  const isQuote = values.type === 'quote';
  const waLink = whatsapp();

  if (status.state === 'success') {
    return (
      <div ref={formRef} className="space-y-5">
        <Alert tone="success" title="Thank you — we've got your request">
          <p>{status.message}</p>
        </Alert>
        <p className="text-navy-600">
          Need an answer sooner?{' '}
          {waLink ? (
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-whatsapp-dark underline">
              Message us on WhatsApp
            </a>
          ) : (
            settings.phone && (
              <a href={telHref(settings.phone)} className="font-semibold text-accent-600 underline">
                Call {settings.phone}
              </a>
            )
          )}
        </p>
        <Button variant="outline" onClick={() => setStatus({ state: 'idle' })}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
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

      {status.state === 'error' && (
        <Alert tone="error" title="We couldn't send your enquiry">
          <p>{status.message}</p>
          {(waLink || settings.phone) && (
            <p className="mt-1">
              You can also reach us{' '}
              {waLink && (
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                  on WhatsApp
                </a>
              )}
              {waLink && settings.phone && ' or '}
              {settings.phone && (
                <a href={telHref(settings.phone)} className="font-semibold underline">
                  by phone
                </a>
              )}
              .
            </p>
          )}
        </Alert>
      )}

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
            {[...new Set([...serviceNames, ...(values.service ? [values.service] : [])])].map((s) => (
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
          required={!isQuote}
          optional={isQuote}
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

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={id('website')}>Leave this field empty</label>
        <input id={id('website')} name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-navy-500">We only use your details to respond to this enquiry.</p>
        <Button type="submit" size="lg" icon={Send} loading={status.state === 'submitting'}>
          {isQuote ? 'Request free quote' : 'Send message'}
        </Button>
      </div>
      {waLink && (
        <p className="text-sm text-navy-600">
          Prefer chatting?{' '}
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-whatsapp-dark hover:underline">
            <WhatsAppIcon className="size-4" /> Message us on WhatsApp
          </a>
        </p>
      )}
    </form>
  );
}
