import { CircleAlert, CircleCheck, X } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { cn } from '../../utils/cn.js';

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback(
    (message, tone = 'success') => {
      const id = crypto.randomUUID();
      setToasts((t) => [...t.slice(-3), { id, message, tone }]);
      setTimeout(() => dismiss(id), tone === 'error' ? 7000 : 4000);
    },
    [dismiss],
  );
  const value = useMemo(() => toast, [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-end gap-2 sm:left-auto" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.tone === 'error' ? 'alert' : 'status'}
            className={cn(
              'pointer-events-auto flex w-full max-w-sm animate-fade-up items-start gap-3 rounded-xl p-4 text-sm font-medium text-white shadow-lift',
              t.tone === 'error' ? 'bg-red-700' : 'bg-navy-900',
            )}
          >
            {t.tone === 'error' ? <CircleAlert className="size-5 shrink-0" aria-hidden="true" /> : <CircleCheck className="size-5 shrink-0 text-emerald-400" aria-hidden="true" />}
            <span className="flex-1">{t.message}</span>
            <button type="button" onClick={() => dismiss(t.id)} className="-m-1 rounded p-1 opacity-70 hover:opacity-100">
              <X className="size-4" aria-hidden="true" />
              <span className="sr-only">Dismiss</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
