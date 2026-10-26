import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn.js';

export function Pagination({ page, totalPages, onChange, className }) {
  if (!totalPages || totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );
  const btn = 'inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-colors';

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center gap-1', className)}>
      <button type="button" className={cn(btn, 'text-navy-700 hover:bg-navy-50 disabled:opacity-40')} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft className="size-5" aria-hidden="true" />
        <span className="sr-only">Previous page</span>
      </button>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center">
          {i > 0 && p - pages[i - 1] > 1 && <span className="px-1 text-navy-400">…</span>}
          <button
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(btn, p === page ? 'bg-navy-900 text-white' : 'text-navy-700 hover:bg-navy-50')}
          >
            {p}
          </button>
        </span>
      ))}
      <button type="button" className={cn(btn, 'text-navy-700 hover:bg-navy-50 disabled:opacity-40')} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        <ChevronRight className="size-5" aria-hidden="true" />
        <span className="sr-only">Next page</span>
      </button>
    </nav>
  );
}
