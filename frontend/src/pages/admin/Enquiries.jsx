import { ChevronDown, Inbox, Mail, Phone, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { AdminPage, STATUS_TONES } from '../../components/admin/AdminPage.jsx';
import { ConfirmButton } from '../../components/admin/ConfirmDialog.jsx';
import { useToast } from '../../components/admin/Toast.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { WhatsAppIcon } from '../../components/ui/Icons.jsx';
import { Pagination } from '../../components/ui/Pagination.jsx';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/States.jsx';
import { ENQUIRY_STATUSES } from '../../config/site.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { admin } from '../../services/endpoints.js';
import { cn } from '../../utils/cn.js';
import { formatDateTime, telHref } from '../../utils/format.js';
import { buildWhatsAppUrl } from '../../utils/whatsapp.js';

function EnquiryRow({ enquiry, onChange, onDelete, canDelete }) {
  const toast = useToast();
  const [open, setOpen] = useState(enquiry.status === 'New');
  const [notes, setNotes] = useState(enquiry.notes || '');
  const [saving, setSaving] = useState(false);
  const wa = buildWhatsAppUrl(enquiry.phone, `Hello ${enquiry.name}, thank you for your enquiry about ${enquiry.service}.`);

  async function save(patch, message) {
    setSaving(true);
    try {
      const { enquiry: updated } = await admin.updateEnquiry(enquiry._id, patch);
      onChange(updated);
      toast(message);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  const details = [
    ['Service', enquiry.service],
    ['Location', enquiry.location],
    ['Property type', enquiry.propertyType],
    ['Preferred start', enquiry.preferredStart],
    ['Email', enquiry.email],
  ].filter(([, v]) => v);

  return (
    <li className="card overflow-hidden">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <button type="button" onClick={() => setOpen((o) => !o)} className="flex min-w-0 flex-1 items-start gap-3 text-left" aria-expanded={open}>
          <ChevronDown className={cn('mt-1 size-5 shrink-0 text-navy-400 transition-transform', open && 'rotate-180')} aria-hidden="true" />
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-navy-900">{enquiry.name}</span>
              <Badge tone={enquiry.type === 'quote' ? 'accent' : 'neutral'}>{enquiry.type === 'quote' ? 'Quote request' : 'Enquiry'}</Badge>
            </span>
            <span className="mt-0.5 block truncate text-sm text-navy-600">
              {enquiry.service} · {enquiry.location} · {formatDateTime(enquiry.createdAt)}
            </span>
          </span>
        </button>
        <label className="flex items-center gap-2 pl-8 sm:pl-0">
          <span className="sr-only">Status for {enquiry.name}</span>
          <Badge tone={STATUS_TONES[enquiry.status]} className="hidden sm:inline-flex">
            {enquiry.status}
          </Badge>
          <select
            className="input h-9 w-auto py-1 text-sm"
            value={enquiry.status}
            disabled={saving}
            onChange={(e) => save({ status: e.target.value }, `Marked as ${e.target.value}`)}
          >
            {ENQUIRY_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      {open && (
        <div className="grid gap-6 border-t border-navy-100 bg-navy-50/40 p-4 sm:p-5 lg:grid-cols-2">
          <div className="space-y-4">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              {details.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="font-semibold text-navy-500">{k}</dt>
                  <dd className="break-words text-navy-900">{v}</dd>
                </div>
              ))}
            </dl>
            {enquiry.message && <p className="rounded-lg bg-white p-3 text-sm whitespace-pre-line text-navy-800 ring-1 ring-navy-100">{enquiry.message}</p>}
            <div className="flex flex-wrap gap-2">
              <Button href={telHref(enquiry.phone)} size="sm" variant="navy" icon={Phone}>
                {enquiry.phone}
              </Button>
              {wa && (
                <Button href={wa} external size="sm" variant="whatsapp" icon={WhatsAppIcon}>
                  WhatsApp
                </Button>
              )}
              {enquiry.email && (
                <Button href={`mailto:${enquiry.email}`} size="sm" variant="outline" icon={Mail}>
                  Email
                </Button>
              )}
            </div>
          </div>
          <div>
            <label htmlFor={`notes-${enquiry._id}`} className="mb-1.5 block text-sm font-semibold text-navy-800">
              Internal notes
            </label>
            <textarea id={`notes-${enquiry._id}`} className="input text-sm" rows={4} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} />
            <div className="mt-3 flex flex-wrap justify-between gap-2">
              <Button size="sm" variant="outline" disabled={notes === (enquiry.notes || '')} loading={saving} onClick={() => save({ notes }, 'Notes saved')}>
                Save notes
              </Button>
              {canDelete && (
                <ConfirmButton
                  size="sm"
                  variant="ghost"
                  icon={Trash2}
                  className="text-red-600"
                  title="Delete enquiry?"
                  message={`This permanently deletes the enquiry from ${enquiry.name}.`}
                  onConfirm={onDelete}
                >
                  Delete
                </ConfirmButton>
              )}
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

export default function Enquiries() {
  const toast = useToast();
  const { isAdmin } = useAuth();
  const [params, setParams] = useSearchParams();
  const status = ENQUIRY_STATUSES.includes(params.get('status')) ? params.get('status') : '';
  const type = ['quote', 'contact'].includes(params.get('type')) ? params.get('type') : '';
  const page = Number(params.get('page')) || 1;
  const [search, setSearch] = useState(params.get('q') || '');
  const q = params.get('q') || '';

  const { data, error, loading, reload, setData } = useAsync(
    (o) => admin.enquiries({ status, type, q, page, limit: 15 }, o),
    [status, type, q, page],
  );

  const update = (patch) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries({ page: '', ...patch })) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    setParams(next);
  };

  useEffect(() => {
    const t = setTimeout(() => search !== q && update({ q: search }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const replaceItem = (updated) => {
    setData((d) => ({ ...d, items: d.items.map((x) => (x._id === updated._id ? updated : x)) }));
    reload();
  };

  async function remove(id) {
    try {
      await admin.deleteEnquiry(id);
      toast('Enquiry deleted');
      reload();
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  const counts = data?.counts || {};
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <AdminPage title="Enquiries" description="Quote requests and messages from the contact form.">
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {['', ...ENQUIRY_STATUSES].map((s) => (
          <button
            key={s || 'all'}
            type="button"
            aria-pressed={status === s}
            onClick={() => update({ status: s })}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              status === s ? 'bg-navy-900 text-white' : 'bg-white text-navy-700 ring-1 ring-navy-200 hover:bg-navy-50',
            )}
          >
            {s || 'All'} <span className="opacity-70">({s ? counts[s] ?? 0 : total})</span>
          </button>
        ))}
      </div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search enquiries</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-navy-400" aria-hidden="true" />
          <input className="input pl-9" placeholder="Search name, phone, email or location" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <label>
          <span className="sr-only">Enquiry type</span>
          <select className="input sm:w-48" value={type} onChange={(e) => update({ type: e.target.value })}>
            <option value="">All types</option>
            <option value="quote">Quote requests</option>
            <option value="contact">General enquiries</option>
          </select>
        </label>
      </div>

      {loading && !data ? (
        <Spinner />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : data.items.length === 0 ? (
        <EmptyState icon={Inbox} title="No enquiries found">
          {status || type || q ? 'Try a different filter.' : 'New enquiries from the website will appear here.'}
        </EmptyState>
      ) : (
        <>
          <ul className={cn('space-y-3', loading && 'opacity-60')}>
            {data.items.map((e) => (
              <EnquiryRow key={e._id} enquiry={e} onChange={replaceItem} onDelete={() => remove(e._id)} canDelete={isAdmin} />
            ))}
          </ul>
          <Pagination page={page} totalPages={data.pagination.totalPages} onChange={(p) => update({ page: String(p) })} className="mt-8" />
        </>
      )}
    </AdminPage>
  );
}
