import { Check, MessageSquareQuote, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { AdminPage, STATUS_TONES } from '../../components/admin/AdminPage.jsx';
import { ConfirmButton } from '../../components/admin/ConfirmDialog.jsx';
import { useToast } from '../../components/admin/Toast.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Pagination } from '../../components/ui/Pagination.jsx';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/States.jsx';
import { StarRating } from '../../components/ui/StarRating.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { admin } from '../../services/endpoints.js';
import { cn } from '../../utils/cn.js';
import { formatDateTime } from '../../utils/format.js';

const TABS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: '', label: 'All' },
];

export default function AdminReviews() {
  const toast = useToast();
  const [status, setStatus] = useState('pending');
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState(null);
  const { data, error, loading, reload } = useAsync((o) => admin.reviews({ status, page, limit: 20 }, o), [status, page]);
  const counts = data?.counts || {};

  async function moderate(review, next) {
    setBusyId(review._id);
    try {
      await admin.moderateReview(review._id, next);
      toast(next === 'approved' ? 'Review approved and published' : 'Review rejected');
      reload();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusyId(null);
    }
  }

  async function remove(review) {
    try {
      await admin.deleteReview(review._id);
      toast('Review deleted');
      reload();
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  return (
    <AdminPage
      title="Website reviews"
      description="Reviews submitted on your website stay hidden until you approve them. Google reviews are managed on Google, not here."
    >
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {TABS.map((t) => (
          <button
            key={t.value || 'all'}
            type="button"
            aria-pressed={status === t.value}
            onClick={() => {
              setStatus(t.value);
              setPage(1);
            }}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              status === t.value ? 'bg-navy-900 text-white' : 'bg-white text-navy-700 ring-1 ring-navy-200 hover:bg-navy-50',
            )}
          >
            {t.label}
            {t.value && <span className="opacity-70"> ({counts[t.value] ?? 0})</span>}
          </button>
        ))}
      </div>

      {loading && !data ? (
        <Spinner />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : data.items.length === 0 ? (
        <EmptyState icon={MessageSquareQuote} title={status === 'pending' ? 'All caught up' : 'No reviews here'}>
          {status === 'pending' ? 'There are no reviews waiting for moderation.' : 'Reviews will appear here once submitted.'}
        </EmptyState>
      ) : (
        <>
          <ul className={cn('grid gap-4 lg:grid-cols-2', loading && 'opacity-60')}>
            {data.items.map((r) => (
              <li key={r._id} className="card flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-navy-900">
                      {r.name}
                      {r.location && <span className="font-normal text-navy-500"> · {r.location}</span>}
                    </p>
                    <p className="text-sm text-navy-500">{formatDateTime(r.createdAt)}</p>
                  </div>
                  <Badge tone={STATUS_TONES[r.status]}>{r.status}</Badge>
                </div>
                <StarRating value={r.rating} className="mt-3" />
                <p className="mt-3 flex-1 whitespace-pre-line text-navy-800">{r.text}</p>
                <div className="mt-5 flex flex-wrap gap-2 border-t border-navy-100 pt-4">
                  {r.status !== 'approved' && (
                    <Button size="sm" icon={Check} variant="navy" loading={busyId === r._id} onClick={() => moderate(r, 'approved')}>
                      Approve
                    </Button>
                  )}
                  {r.status !== 'rejected' && (
                    <Button size="sm" icon={X} variant="outline" disabled={busyId === r._id} onClick={() => moderate(r, 'rejected')}>
                      {r.status === 'approved' ? 'Unpublish' : 'Reject'}
                    </Button>
                  )}
                  <ConfirmButton
                    size="sm"
                    variant="ghost"
                    icon={Trash2}
                    className="ml-auto text-red-600"
                    title="Delete review?"
                    message="This permanently deletes the review."
                    onConfirm={() => remove(r)}
                  >
                    Delete
                  </ConfirmButton>
                </div>
              </li>
            ))}
          </ul>
          <Pagination page={page} totalPages={data.pagination.totalPages} onChange={setPage} className="mt-8" />
        </>
      )}
    </AdminPage>
  );
}
