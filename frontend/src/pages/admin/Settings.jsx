import { ExternalLink, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AdminPage } from '../../components/admin/AdminPage.jsx';
import { useToast } from '../../components/admin/Toast.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Field, fieldProps } from '../../components/ui/Field.jsx';
import { Alert } from '../../components/ui/States.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { admin } from '../../services/endpoints.js';
import { buildWhatsAppUrl } from '../../utils/whatsapp.js';

const toForm = (s) => ({
  businessName: s.businessName || '',
  tagline: s.tagline || '',
  logoUrl: s.logoUrl || '',
  phone: s.phone || '',
  email: s.email || '',
  whatsappNumber: s.whatsappNumber || '',
  whatsappDefaultMessage: s.whatsappDefaultMessage || '',
  address: { street: '', city: '', region: '', postalCode: '', country: '', ...s.address },
  geo: { lat: s.geo?.lat ?? '', lng: s.geo?.lng ?? '' },
  serviceAreasText: (s.serviceAreas || []).join('\n'),
  workingHours: s.workingHours?.length ? s.workingHours.map((h) => ({ days: h.days, hours: h.hours })) : [],
  googleMapsUrl: s.googleMapsUrl || '',
  googleReviewUrl: s.googleReviewUrl || '',
  googleMapsEmbedUrl: s.googleMapsEmbedUrl || '',
  social: { facebook: '', instagram: '', youtube: '', ...s.social },
  stats: { yearsExperience: s.stats?.yearsExperience ?? '', projectsCompleted: s.stats?.projectsCompleted ?? '', teamSize: s.stats?.teamSize ?? '' },
});

const numOrNull = (v) => (v === '' || v === null ? null : Number(v));

function Section({ title, description, children }) {
  return (
    <section className="card p-5 sm:p-6">
      <h2 className="font-sans text-lg font-bold">{title}</h2>
      {description && <p className="mt-1 text-sm text-navy-600">{description}</p>}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export default function AdminSettings() {
  const { settings, refresh } = useSettings();
  const { isAdmin } = useAuth();
  const toast = useToast();
  const [values, setValues] = useState(() => toForm(settings));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (path) => (e) => {
    const value = e.target.value;
    setValues((v) => {
      const [a, b] = path.split('.');
      return b ? { ...v, [a]: { ...v[a], [b]: value } } : { ...v, [a]: value };
    });
    setErrors((er) => ({ ...er, [path]: undefined }));
  };
  const f = (path, label, opts = {}) => (
    <Field id={path} label={label} error={errors[path]} hint={opts.hint} optional={opts.optional} required={opts.required} className={opts.wide ? 'sm:col-span-2' : ''}>
      <input
        {...fieldProps(path, errors[path], { hint: opts.hint })}
        type={opts.type || 'text'}
        inputMode={opts.inputMode}
        placeholder={opts.placeholder}
        value={path.split('.').reduce((o, k) => o?.[k], values) ?? ''}
        onChange={set(path)}
        disabled={!isAdmin}
      />
    </Field>
  );

  const setHours = (i, key, value) =>
    setValues((v) => ({ ...v, workingHours: v.workingHours.map((h, j) => (j === i ? { ...h, [key]: value } : h)) }));

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    setErrors({});
    const { serviceAreasText, ...rest } = values;
    const payload = {
      ...rest,
      serviceAreas: serviceAreasText.split('\n').map((s) => s.trim()).filter(Boolean),
      workingHours: values.workingHours.filter((h) => h.days.trim() && h.hours.trim()),
      geo: { lat: numOrNull(values.geo.lat), lng: numOrNull(values.geo.lng) },
      stats: {
        yearsExperience: numOrNull(values.stats.yearsExperience),
        projectsCompleted: numOrNull(values.stats.projectsCompleted),
        teamSize: numOrNull(values.stats.teamSize),
      },
    };
    try {
      await admin.updateSettings(payload);
      await refresh();
      toast('Settings saved — the website is updated');
    } catch (err) {
      setErrors(err.details || {});
      setFormError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  }

  const waPreview = buildWhatsAppUrl(values.whatsappNumber, values.whatsappDefaultMessage);

  return (
    <AdminPage title="Business settings" description="Contact details, WhatsApp and Google links used across the whole website.">
      <form onSubmit={onSubmit} noValidate className="space-y-6">
        {!isAdmin && <Alert tone="info">Only admin accounts can change business settings. You can view them here.</Alert>}
        {formError && <Alert tone="error">{formError}</Alert>}

        <Section title="Business">
          {f('businessName', 'Business name', { required: true })}
          {f('tagline', 'Tagline', { optional: true })}
          {f('logoUrl', 'Logo URL', { optional: true, wide: true, hint: 'https:// link to your logo. Leave empty to use the built-in mark.' })}
        </Section>

        <Section title="Contact">
          {f('phone', 'Phone number', { type: 'tel', placeholder: '+1 555 123 4567' })}
          {f('email', 'Email', { type: 'email' })}
          {f('address.street', 'Street address', { wide: true })}
          {f('address.city', 'City')}
          {f('address.region', 'State / region')}
          {f('address.postalCode', 'Postal code')}
          {f('address.country', 'Country', { hint: 'e.g. US, GB, IN' })}
          <Field id="serviceAreasText" label="Service areas" hint="One per line. Used in page titles, the footer and local SEO." className="sm:col-span-2">
            <textarea {...fieldProps('serviceAreasText', errors.serviceAreas, { hint: true })} rows={4} value={values.serviceAreasText} onChange={set('serviceAreasText')} disabled={!isAdmin} />
          </Field>
          <div className="sm:col-span-2">
            <p className="mb-1.5 text-sm font-semibold text-navy-800">Working hours</p>
            <ul className="space-y-2">
              {values.workingHours.map((h, i) => (
                <li key={i} className="flex gap-2">
                  <input className="input" aria-label="Days" placeholder="Monday – Friday" value={h.days} onChange={(e) => setHours(i, 'days', e.target.value)} disabled={!isAdmin} />
                  <input className="input" aria-label="Hours" placeholder="8:00 AM – 6:00 PM" value={h.hours} onChange={(e) => setHours(i, 'hours', e.target.value)} disabled={!isAdmin} />
                  <Button variant="ghost" size="sm" className="h-11 text-red-600" onClick={() => setValues((v) => ({ ...v, workingHours: v.workingHours.filter((_, j) => j !== i) }))} disabled={!isAdmin}>
                    <Trash2 className="size-4" aria-hidden="true" />
                    <span className="sr-only">Remove row</span>
                  </Button>
                </li>
              ))}
            </ul>
            <Button variant="outline" size="sm" icon={Plus} className="mt-2" disabled={!isAdmin} onClick={() => setValues((v) => ({ ...v, workingHours: [...v.workingHours, { days: '', hours: '' }] }))}>
              Add row
            </Button>
          </div>
        </Section>

        <Section title="WhatsApp" description="Customers tap a button and WhatsApp opens with your message pre-filled. They still press send themselves.">
          {f('whatsappNumber', 'WhatsApp number', {
            inputMode: 'numeric',
            placeholder: '15551234567',
            hint: 'International format, digits only: country code + number, no +, spaces or dashes.',
          })}
          <div className="flex items-end">
            {waPreview ? (
              <Button href={waPreview} external variant="outline" iconRight={ExternalLink}>
                Test WhatsApp link
              </Button>
            ) : (
              <p className="text-sm text-navy-500">Without a number, the site shows a call button instead.</p>
            )}
          </div>
          <Field id="whatsappDefaultMessage" label="Default message" error={errors.whatsappDefaultMessage} className="sm:col-span-2">
            <textarea {...fieldProps('whatsappDefaultMessage', errors.whatsappDefaultMessage)} rows={3} maxLength={500} value={values.whatsappDefaultMessage} onChange={set('whatsappDefaultMessage')} disabled={!isAdmin} />
          </Field>
        </Section>

        <Section
          title="Google Business Profile"
          description="Use your own profile's official links. In Google Business Profile, choose “Ask for reviews” to copy your review link, and “Share” for your Maps link."
        >
          {f('googleMapsUrl', 'Google Maps / profile URL', { wide: true, placeholder: 'https://maps.app.goo.gl/…', hint: 'Used for the “Read Google Reviews” button.' })}
          {f('googleReviewUrl', 'Google review link', { wide: true, placeholder: 'https://g.page/r/…/review', hint: 'Used for the “Review Us on Google” button.' })}
          {f('googleMapsEmbedUrl', 'Map embed URL', {
            wide: true,
            optional: true,
            placeholder: 'https://www.google.com/maps/embed?pb=…',
            hint: 'Google Maps → Share → Embed a map → copy only the src="…" URL. Leave empty to map your address.',
          })}
          {f('geo.lat', 'Latitude', { optional: true, inputMode: 'decimal' })}
          {f('geo.lng', 'Longitude', { optional: true, inputMode: 'decimal' })}
        </Section>

        <Section title="About page figures" description="Only shown when filled in. Please use accurate numbers.">
          {f('stats.yearsExperience', 'Years of experience', { type: 'number', optional: true })}
          {f('stats.projectsCompleted', 'Projects completed', { type: 'number', optional: true })}
          {f('stats.teamSize', 'Team size', { type: 'number', optional: true })}
        </Section>

        <Section title="Social media">
          {f('social.facebook', 'Facebook URL', { optional: true })}
          {f('social.instagram', 'Instagram URL', { optional: true })}
          {f('social.youtube', 'YouTube URL', { optional: true })}
        </Section>

        {isAdmin && (
          <div className="sticky bottom-4 flex justify-end">
            <Button type="submit" size="lg" icon={Save} loading={saving} className="shadow-lift">
              Save settings
            </Button>
          </div>
        )}
      </form>
    </AdminPage>
  );
}
