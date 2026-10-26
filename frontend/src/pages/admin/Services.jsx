import { PaintRoller, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AdminPage } from '../../components/admin/AdminPage.jsx';
import { ConfirmButton } from '../../components/admin/ConfirmDialog.jsx';
import { ImageUploader } from '../../components/admin/ImageUploader.jsx';
import { useToast } from '../../components/admin/Toast.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Field, fieldProps } from '../../components/ui/Field.jsx';
import { NamedIcon } from '../../components/ui/Icons.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { ResponsiveImage } from '../../components/ui/ResponsiveImage.jsx';
import { Alert, EmptyState, ErrorState, Spinner } from '../../components/ui/States.jsx';
import { SERVICE_ICONS } from '../../config/site.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { admin } from '../../services/endpoints.js';

const EMPTY = { title: '', summary: '', description: '', features: [], icon: 'PaintRoller', image: null, order: 0, active: true };

function ServiceForm({ initial, onSaved, onCancel }) {
  const [values, setValues] = useState({ ...EMPTY, ...initial, featuresText: (initial?.features || []).join('\n') });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    const payload = {
      title: values.title,
      summary: values.summary,
      description: values.description,
      features: values.featuresText.split('\n').map((s) => s.trim()).filter(Boolean),
      icon: values.icon,
      image: values.image || null,
      order: Number(values.order) || 0,
      active: values.active,
    };
    try {
      const res = initial?._id ? await admin.updateService(initial._id, payload) : await admin.createService(payload);
      onSaved(res.service);
    } catch (err) {
      setErrors(err.details || {});
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 p-5">
      {formError && <Alert tone="error">{formError}</Alert>}
      <Field id="svc-title" label="Title" required error={errors.title}>
        <input {...fieldProps('svc-title', errors.title)} maxLength={100} value={values.title} onChange={set('title')} />
      </Field>
      <Field id="svc-summary" label="Summary" required error={errors.summary} hint="Shown on service cards (max 240 characters).">
        <textarea {...fieldProps('svc-summary', errors.summary, { hint: true })} rows={2} maxLength={240} value={values.summary} onChange={set('summary')} />
      </Field>
      <Field id="svc-description" label="Description" optional error={errors.description}>
        <textarea {...fieldProps('svc-description', errors.description)} rows={4} maxLength={3000} value={values.description} onChange={set('description')} />
      </Field>
      <Field id="svc-features" label="Key features" optional hint="One per line, up to 12." error={errors.features}>
        <textarea {...fieldProps('svc-features', errors.features, { hint: true })} rows={4} value={values.featuresText} onChange={set('featuresText')} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="svc-icon" label="Icon">
          <select {...fieldProps('svc-icon')} value={values.icon} onChange={set('icon')}>
            {SERVICE_ICONS.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </Field>
        <Field id="svc-order" label="Display order" hint="Lower numbers appear first.">
          <input {...fieldProps('svc-order', null, { hint: true })} type="number" min="0" max="1000" value={values.order} onChange={set('order')} />
        </Field>
      </div>
      <ImageUploader label="Image" folder="services" value={[values.image]} onChange={(imgs) => setValues((v) => ({ ...v, image: imgs[0] || null }))} />
      <label className="flex items-center gap-3">
        <input type="checkbox" className="size-4 accent-accent-600" checked={values.active} onChange={set('active')} />
        <span className="font-semibold">Show on website</span>
      </label>
      <div className="flex justify-end gap-3 border-t border-navy-100 pt-5">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          Save service
        </Button>
      </div>
    </form>
  );
}

export default function AdminServices() {
  const toast = useToast();
  const { isAdmin } = useAuth();
  const { data, error, loading, reload } = useAsync((o) => admin.services(o), []);
  const [editing, setEditing] = useState(null); // null | {} (new) | service

  async function remove(s) {
    try {
      await admin.deleteService(s._id);
      toast('Service deleted');
      reload();
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  return (
    <AdminPage
      title="Services"
      description="The services listed on your website and in the quote form."
      actions={
        <Button icon={Plus} onClick={() => setEditing({})}>
          New service
        </Button>
      }
    >
      {loading && !data ? (
        <Spinner />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : data.items.length === 0 ? (
        <EmptyState icon={PaintRoller} title="No services yet" />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {data.items.map((s) => (
            <li key={s._id} className="card flex gap-4 p-4">
              <ResponsiveImage image={s.image} sizes="120px" className="aspect-square w-24 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <NamedIcon name={s.icon} className="size-4 text-accent-600" />
                  <p className="font-bold">{s.title}</p>
                  {!s.active && <Badge>Hidden</Badge>}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-navy-600">{s.summary}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" icon={Pencil} onClick={() => setEditing(s)}>
                    Edit
                  </Button>
                  {isAdmin && (
                    <ConfirmButton
                      size="sm"
                      variant="ghost"
                      icon={Trash2}
                      className="text-red-600"
                      title="Delete service?"
                      message={`"${s.title}" will be removed from the website. To hide it temporarily, untick “Show on website” instead.`}
                      onConfirm={() => remove(s)}
                    >
                      Delete
                    </ConfirmButton>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?._id ? 'Edit service' : 'New service'}>
        {editing !== null && (
          <ServiceForm
            initial={editing}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              toast('Service saved');
              setEditing(null);
              reload();
            }}
          />
        )}
      </Modal>
    </AdminPage>
  );
}
