/** Consistent page header for admin screens. */
export function AdminPage({ title, description, actions, children }) {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-sans text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">{title}</h1>
          {description && <p className="mt-1 text-navy-600">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export const STATUS_TONES = {
  New: 'accent',
  Contacted: 'info',
  'In Progress': 'warning',
  Completed: 'success',
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
};
