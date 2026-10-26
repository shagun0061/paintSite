import { Send } from 'lucide-react';
import { useId, useState } from 'react';
import { submitReview } from '../services/endpoints.js';
import { validateReview } from '../utils/validation.js';
import { Button } from './ui/Button.jsx';
import { Field, fieldProps } from './ui/Field.jsx';
import { StarInput } from './ui/StarRating.jsx';
import { Alert } from './ui/States.jsx';

const empty = { name: '', location: '', rating: 0, text: '', website: '' };

export function ReviewForm() {
  const uid = useId();
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle' });
  const id = (n) => `${uid}-${n}`;

  const set = (name) => (e) => {
    const value = e?.target ? e.target.value : e;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    const errs = validateReview(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus({ state: 'submitting' });
    try {
      const res = await submitReview(values);
      setStatus({ state: 'success', message: res.message });
      setValues(empty);
    } catch (err) {
      setErrors(err.details || {});
      setStatus({ state: 'error', message: err.message });
    }
  }

  if (status.state === 'success') {
    return (
      <div className="space-y-4">
        <Alert tone="success" title="Thank you for your review!">
          <p>{status.message}</p>
        </Alert>
        <Button variant="outline" size="sm" onClick={() => setStatus({ state: 'idle' })}>
          Write another review
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {status.state === 'error' && (
        <Alert tone="error" title="Your review wasn't sent">
          <p>{status.message}</p>
        </Alert>
      )}
      <StarInput value={values.rating} onChange={set('rating')} error={errors.rating} name={id('rating')} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={id('name')} label="Your name" required error={errors.name}>
          <input {...fieldProps(id('name'), errors.name)} autoComplete="name" value={values.name} onChange={set('name')} />
        </Field>
        <Field id={id('location')} label="Area" optional>
          <input {...fieldProps(id('location'))} value={values.location} onChange={set('location')} />
        </Field>
      </div>
      <Field id={id('text')} label="Your feedback" required error={errors.text}>
        <textarea {...fieldProps(id('text'), errors.text)} rows={5} maxLength={1500} value={values.text} onChange={set('text')} />
      </Field>
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={id('website')}>Leave this field empty</label>
        <input id={id('website')} tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
      </div>
      <p className="text-sm text-navy-500">Reviews are checked by our team before they appear on the website.</p>
      <Button type="submit" icon={Send} loading={status.state === 'submitting'}>
        Submit review
      </Button>
    </form>
  );
}
