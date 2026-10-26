import { Star } from 'lucide-react';
import { cn } from '../../utils/cn.js';

export function StarRating({ value, size = 'size-4', className }) {
  const rounded = Math.round(value || 0);
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} role="img" aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(size, n <= rounded ? 'fill-accent-500 text-accent-500' : 'fill-navy-100 text-navy-100')}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

/** Accessible 1–5 star picker built on native radio inputs (arrow keys work). */
export function StarInput({ value, onChange, error, name = 'rating' }) {
  const labels = ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'];
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="mb-1.5 block text-sm font-semibold text-navy-800">
        Your rating<span className="text-accent-600" aria-hidden="true"> *</span>
      </legend>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer rounded-md p-0.5 has-focus-visible:outline-2 has-focus-visible:outline-accent-500">
            <input
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              className="sr-only"
            />
            <Star
              className={cn(
                'size-8 transition-colors',
                n <= value ? 'fill-accent-500 text-accent-500' : 'fill-transparent text-navy-200 hover:text-accent-400',
              )}
              aria-hidden="true"
            />
            <span className="sr-only">
              {n} star{n > 1 && 's'} – {labels[n - 1]}
            </span>
          </label>
        ))}
        {value > 0 && <span className="ml-2 text-sm font-medium text-navy-600">{labels[value - 1]}</span>}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  );
}
