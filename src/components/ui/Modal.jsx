import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn.js';

/**
 * Native <dialog> modal: gives us focus trapping, Escape-to-close and
 * inert background for free. Clicking the backdrop closes it.
 */
export function Modal({ open, onClose, title, children, className, panelClassName, hideHeader = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={hideHeader ? title : undefined}
      aria-labelledby={hideHeader ? undefined : 'modal-title'}
      className={cn(
        'm-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-2xl overflow-visible bg-transparent p-0 backdrop:bg-navy-950/70 backdrop:backdrop-blur-sm open:animate-fade-up',
        className,
      )}
    >
      {open && (
        <div className={cn('max-h-[92dvh] overflow-y-auto rounded-2xl bg-white shadow-lift', panelClassName)}>
          {!hideHeader && (
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-navy-100 bg-white px-5 py-4">
              <h2 id="modal-title" className="font-sans text-lg font-bold text-navy-900">
                {title}
              </h2>
              <button type="button" onClick={onClose} className="rounded-full p-2 text-navy-500 hover:bg-navy-50 hover:text-navy-900">
                <X className="size-5" aria-hidden="true" />
                <span className="sr-only">Close</span>
              </button>
            </div>
          )}
          {children}
        </div>
      )}
    </dialog>
  );
}
