import { ArrowRight, FolderKanban, Inbox, MessageSquareQuote, PaintRoller } from 'lucide-react';
import { Link } from 'react-router';
import { AdminPage, STATUS_TONES } from '../../components/admin/AdminPage.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/States.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { admin } from '../../services/endpoints.js';
import { formatDateTime } from '../../utils/format.js';

function StatCard({ to, icon: Icon, label, value, sub, highlight }) {
  return (
    <Link to={to} className="card group flex items-start justify-between p-5 transition-shadow hover:shadow-lift">
      <div>
        <p className="text-sm font-semibold text-navy-500">{label}</p>
        <p className={`mt-2 text-3xl font-extrabold ${highlight ? 'text-accent-600' : 'text-navy-900'}`}>{value}</p>
        {sub && <p className="mt-1 text-sm text-navy-500">{sub}</p>}
      </div>
      <span className="inline-flex size-11 items-center justify-center rounded-xl bg-navy-50 text-navy-700 group-hover:bg-accent-50 group-hover:text-accent-600">
        <Icon className="size-5" aria-hidden="true" />
      </span>
    </Link>
  );
}

function SetupChecklist() {
  const { settings } = useSettings();
  const missing = [
    !settings.googleReviewUrl && 'Add your Google review link',
    !settings.googleMapsUrl && 'Add your Google Maps / Business Profile link',
    settings.email?.endsWith('example.com') && 'Replace the placeholder email address',
    settings.whatsappNumber === '15550001234' && 'Replace the placeholder WhatsApp number',
    settings.address?.street === '123 Example Street' && 'Replace the placeholder address',
  ].filter(Boolean);
  if (!missing.length) return null;
  return (
    <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <p className="font-bold text-amber-900">Finish setting up your website</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900">
        {missing.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
      <Button to="/admin/settings" size="sm" variant="navy" className="mt-4">
        Open business settings
      </Button>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data, error, loading, reload } = useAsync((o) => admin.stats(o), []);

  return (
    <AdminPage title={`Welcome back${user?.name ? `, ${user.name.split(' ')[0]}` : ''}`} description="Here's what needs your attention.">
      <SetupChecklist />
      {loading && !data ? (
        <Spinner />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard to="/admin/enquiries?status=New" icon={Inbox} label="New enquiries" value={data.newEnquiries} sub={`${data.openEnquiries} in progress`} highlight={data.newEnquiries > 0} />
            <StatCard to="/admin/reviews" icon={MessageSquareQuote} label="Reviews to moderate" value={data.pendingReviews} highlight={data.pendingReviews > 0} />
            <StatCard to="/admin/projects" icon={FolderKanban} label="Published projects" value={data.publishedProjects} sub={`${data.draftProjects} drafts`} />
            <StatCard to="/admin/services" icon={PaintRoller} label="Active services" value={data.activeServices} />
          </div>

          <section className="card mt-8 overflow-hidden">
            <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4">
              <h2 className="font-sans text-lg font-bold">Latest enquiries</h2>
              <Link to="/admin/enquiries" className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:underline">
                View all <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            {data.recentEnquiries.length === 0 ? (
              <EmptyState icon={Inbox} title="No enquiries yet" className="m-5">
                Quote requests and contact form messages will appear here.
              </EmptyState>
            ) : (
              <ul className="divide-y divide-navy-100">
                {data.recentEnquiries.map((e) => (
                  <li key={e._id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold text-navy-900">
                        {e.name} <span className="font-normal text-navy-500">· {e.type === 'quote' ? 'Quote request' : 'Enquiry'}</span>
                      </p>
                      <p className="truncate text-sm text-navy-600">
                        {e.service} · {e.location}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-sm text-navy-500">{formatDateTime(e.createdAt)}</span>
                      <Badge tone={STATUS_TONES[e.status]}>{e.status}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </AdminPage>
  );
}
