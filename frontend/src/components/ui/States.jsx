import { CircleAlert, CircleCheck, Info, LoaderCircle, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { Button } from './Button.jsx';

export function Spinner({ label = 'Loading…', className }) {
  return (
    <div role="status" className={cn('flex items-center justify-center gap-2 py-10 text-navy-500', className)}>
      <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function SkeletonCards({ count = 3, className = 'aspect-[4/3]' }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-navy-100 bg-white">
          <div className={cn('animate-pulse bg-beige-100', className)} />
          <div className="space-y-3 p-5">
            <div className="h-3 w-1/3 animate-pulse rounded bg-beige-100" />
            <div className="h-5 w-2/3 animate-pulse rounded bg-beige-100" />
            <div className="h-3 w-full animate-pulse rounded bg-beige-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon = Info, title, children, action, className }) {
  return (
    <div className={cn('rounded-2xl border border-dashed border-navy-200 bg-beige-50 px-6 py-12 text-center', className)}>
      <Icon className="mx-auto size-10 text-navy-300" aria-hidden="true" />
      <h3 className="mt-4 font-sans text-lg font-bold text-navy-900">{title}</h3>
      {children && <div className="mx-auto mt-2 max-w-md text-navy-600">{children}</div>}
      {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}

export function ErrorState({ error, onRetry, title = 'Something went wrong', className }) {
  return (
    <div role="alert" className={cn('rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center', className)}>
      <CircleAlert className="mx-auto size-9 text-red-500" aria-hidden="true" />
      <h3 className="mt-3 font-sans text-lg font-bold text-navy-900">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-navy-600">{error?.message || 'Please try again in a moment.'}</p>
      {onRetry && (
        <Button variant="outline" size="sm" icon={RefreshCw} onClick={onRetry} className="mt-5">
          Try again
        </Button>
      )}
    </div>
  );
}

const TONES = {
  success: { box: 'border-emerald-200 bg-emerald-50 text-emerald-900', Icon: CircleCheck, icon: 'text-emerald-600' },
  error: { box: 'border-red-200 bg-red-50 text-red-900', Icon: CircleAlert, icon: 'text-red-600' },
  info: { box: 'border-navy-200 bg-navy-50 text-navy-900', Icon: Info, icon: 'text-navy-600' },
};

export function Alert({ tone = 'info', title, children, className }) {
  const t = TONES[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn('flex gap-3 rounded-xl border p-4', t.box, className)}>
      <t.Icon className={cn('mt-0.5 size-5 shrink-0', t.icon)} aria-hidden="true" />
      <div className="text-sm leading-relaxed">
        {title && <p className="font-bold">{title}</p>}
        {children}
      </div>
    </div>
  );
}
