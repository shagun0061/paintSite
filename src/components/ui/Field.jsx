import { cn } from '../../utils/cn.js';

/** Label + control + hint/error, wired up for screen readers via `fieldProps`. */
export function Field({ id, label, error, hint, required, optional, className, children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy-800">
        {label}
        {required && (
          <span className="text-accent-600" aria-hidden="true">
            {' '}
            *
          </span>
        )}
        {optional && <span className="font-normal text-navy-400"> (optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-navy-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export const fieldProps = (id, error, { hint, required } = {}) => ({
  id,
  name: id,
  required: required || undefined,
  'aria-invalid': error ? true : undefined,
  'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  className: cn('input'),
});
