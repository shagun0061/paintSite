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
