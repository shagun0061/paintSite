import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { AdminPage } from '../../components/admin/AdminPage.jsx';
import { ImageUploader } from '../../components/admin/ImageUploader.jsx';
import { useToast } from '../../components/admin/Toast.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Field, fieldProps } from '../../components/ui/Field.jsx';
import { Alert, ErrorState, Spinner } from '../../components/ui/States.jsx';
import { PROJECT_CATEGORIES } from '../../config/site.js';
import { admin } from '../../services/endpoints.js';

const EMPTY = {
  title: '',
  category: 'Interior',
  summary: '',
  description: '',
  location: '',
  completedAt: '',
  coverImage: null,
  beforeImage: null,
  afterImage: null,
  gallery: [],
  featured: false,
  published: false,
};

const toForm = (p) => ({
  ...EMPTY,
  ...p,
  completedAt: p.completedAt ? p.completedAt.slice(0, 10) : '',
  beforeImage: p.beforeImage || null,
  afterImage: p.afterImage || null,
  gallery: p.gallery || [],
});

export default function ProjectEditor() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const toast = useToast();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState(isNew ? 'ready' : 'loading');
  const [loadError, setLoadError] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isNew) return undefined;
    const controller = new AbortController();
    admin
      .project(id, { signal: controller.signal })
      .then(({ project }) => {
        setValues(toForm(project));
        setState('ready');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setLoadError(err);
        setState('error');
      });
    return () => controller.abort();
  }, [id, isNew]);

  const set = (name) => (e) => {
    const value = e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };
  const single = (name) => (images) => set(name)(images[0] || null);

  async function onSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (values.title.trim().length < 3) errs.title = 'Title must be at least 3 characters';
    if (!values.coverImage) errs.coverImage = 'A cover photo is required';
    if (!!values.beforeImage !== !!values.afterImage) errs.afterImage = 'Add both a before and an after photo, or neither';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setState('saving');
    setFormError('');
    try {
      const payload = { ...values };
      for (const k of ['_id', 'slug', 'createdAt', 'updatedAt', '__v']) delete payload[k];
      if (isNew) await admin.createProject(payload);
      else await admin.updateProject(id, payload);
      toast(isNew ? 'Project created' : 'Project saved');
      navigate('/admin/projects');
    } catch (err) {
      const details = Object.fromEntries(Object.entries(err.details || {}).map(([k, v]) => [k.split('.')[0], v]));
      setErrors(details);
      setFormError(err.message);
      setState('ready');
    }
  }

  if (state === 'loading') return <Spinner />;
  if (state === 'error') return <ErrorState error={loadError} title="Project couldn't be loaded" />;

  return (
    <AdminPage
      title={isNew ? 'New project' : 'Edit project'}
      actions={
        <Button to="/admin/projects" variant="ghost" icon={ArrowLeft}>
          Back to projects
        </Button>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-6">
        {formError && <Alert tone="error">{formError}</Alert>}

        <section className="card space-y-5 p-5 sm:p-6">
          <h2 className="font-sans text-lg font-bold">Details</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="title" label="Title" required error={errors.title} className="sm:col-span-2">
              <input {...fieldProps('title', errors.title)} maxLength={120} value={values.title} onChange={set('title')} />
            </Field>
            <Field id="category" label="Category" required>
              <select {...fieldProps('category')} value={values.category} onChange={set('category')}>
                {PROJECT_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field id="location" label="Location" optional error={errors.location}>
              <input {...fieldProps('location', errors.location)} maxLength={120} value={values.location} onChange={set('location')} />
            </Field>
            <Field id="completedAt" label="Completion date" optional error={errors.completedAt}>
              <input {...fieldProps('completedAt', errors.completedAt)} type="date" value={values.completedAt} onChange={set('completedAt')} />
            </Field>
            <Field id="summary" label="Short summary" optional hint="One sentence shown on project cards (max 240 characters)." error={errors.summary} className="sm:col-span-2">
              <input {...fieldProps('summary', errors.summary, { hint: true })} maxLength={240} value={values.summary} onChange={set('summary')} />
            </Field>
            <Field id="description" label="Full description" optional hint="Leave a blank line between paragraphs." error={errors.description} className="sm:col-span-2">
              <textarea {...fieldProps('description', errors.description, { hint: true })} rows={7} maxLength={5000} value={values.description} onChange={set('description')} />
            </Field>
          </div>
        </section>

        <section className="card space-y-6 p-5 sm:p-6">
          <h2 className="font-sans text-lg font-bold">Photos</h2>
          <ImageUploader label="Cover photo" required value={[values.coverImage]} onChange={single('coverImage')} error={errors.coverImage} />
          <div className="grid gap-6 sm:grid-cols-2">
            <ImageUploader label="Before photo" value={[values.beforeImage]} onChange={single('beforeImage')} error={errors.beforeImage} hint="Optional — shows a before/after slider." />
            <ImageUploader label="After photo" value={[values.afterImage]} onChange={single('afterImage')} error={errors.afterImage} />
          </div>
          <ImageUploader label="Gallery" max={30} value={values.gallery} onChange={set('gallery')} error={errors.gallery} hint="Use the arrows to reorder. Add alt text to describe each photo." />
        </section>

        <section className="card space-y-3 p-5 sm:p-6">
          <h2 className="font-sans text-lg font-bold">Visibility</h2>
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 size-4 accent-accent-600" checked={values.published} onChange={set('published')} />
            <span>
              <span className="font-semibold">Published</span>
              <span className="block text-sm text-navy-600">Show this project on the Our Work page.</span>
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 size-4 accent-accent-600" checked={values.featured} onChange={set('featured')} />
            <span>
              <span className="font-semibold">Featured</span>
              <span className="block text-sm text-navy-600">Also show it in “Recent projects” on the home page.</span>
            </span>
          </label>
        </section>

        <div className="flex flex-wrap justify-end gap-3">
          <Link to="/admin/projects" className="inline-flex h-11 items-center px-4 font-semibold text-navy-600 hover:text-navy-900">
            Cancel
          </Link>
          <Button type="submit" icon={Save} loading={state === 'saving'}>
            {isNew ? 'Create project' : 'Save changes'}
          </Button>
        </div>
      </form>
    </AdminPage>
  );
}
