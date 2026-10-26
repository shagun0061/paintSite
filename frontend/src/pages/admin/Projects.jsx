import { Eye, FolderKanban, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { AdminPage } from '../../components/admin/AdminPage.jsx';
import { ConfirmButton } from '../../components/admin/ConfirmDialog.jsx';
import { useToast } from '../../components/admin/Toast.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Pagination } from '../../components/ui/Pagination.jsx';
import { ResponsiveImage } from '../../components/ui/ResponsiveImage.jsx';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/States.jsx';
import { PROJECT_CATEGORIES } from '../../config/site.js';
import { useAsync } from '../../hooks/useAsync.js';
import { admin } from '../../services/endpoints.js';
import { cn } from '../../utils/cn.js';
import { formatDate } from '../../utils/format.js';

export default function AdminProjects() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const { data, error, loading, reload, setData } = useAsync(
    (o) => admin.projects({ page, category, q, limit: 20 }, o),
    [page, category, q],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  async function toggle(project, field) {
    try {
      const { project: updated } = await admin.setProjectFlags(project._id, { [field]: !project[field] });
      setData((d) => ({ ...d, items: d.items.map((p) => (p._id === updated._id ? { ...p, ...updated } : p)) }));
      toast(field === 'published' ? (updated.published ? 'Project published' : 'Project moved to drafts') : updated.featured ? 'Featured on home page' : 'Removed from home page');
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  async function remove(project) {
    try {
      await admin.deleteProject(project._id);
      toast('Project deleted');
      reload();
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  return (
    <AdminPage
      title="Portfolio projects"
      description="Published projects appear on the Our Work page. Featured ones also show on the home page."
      actions={
        <Button to="/admin/projects/new" icon={Plus}>
          New project
        </Button>
      }
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search projects</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-navy-400" aria-hidden="true" />
          <input className="input pl-9" placeholder="Search by title" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <label>
          <span className="sr-only">Category</span>
          <select
            className="input sm:w-48"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All categories</option>
            {PROJECT_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      {loading && !data ? (
        <Spinner />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : data.items.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects yet" action={<Button to="/admin/projects/new" icon={Plus}>Add your first project</Button>}>
          Add photos of your finished jobs to build trust with new customers.
        </EmptyState>
      ) : (
        <>
          <ul className={cn('space-y-3', loading && 'opacity-60')}>
            {data.items.map((p) => (
              <li key={p._id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <ResponsiveImage image={p.coverImage} sizes="160px" className="aspect-[4/3] w-full shrink-0 rounded-lg object-cover sm:w-32" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`/admin/projects/${p._id}`} className="font-bold text-navy-900 hover:underline">
                      {p.title}
                    </Link>
                    <Badge tone={p.published ? 'success' : 'neutral'}>{p.published ? 'Published' : 'Draft'}</Badge>
                    {p.featured && <Badge tone="accent">Featured</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-navy-600">
                    {[p.category, p.location, formatDate(p.completedAt, { month: 'short', year: 'numeric' })].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" variant={p.published ? 'outline' : 'navy'} onClick={() => toggle(p, 'published')}>
                    {p.published ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toggle(p, 'featured')} aria-pressed={p.featured} title="Feature on home page">
                    <Star className={cn('size-4', p.featured && 'fill-accent-500 text-accent-500')} aria-hidden="true" />
                    <span className="sr-only">Feature on home page</span>
                  </Button>
                  {p.published && (
                    <Button size="sm" variant="ghost" href={`/portfolio/${p.slug}`} external title="View on website">
                      <Eye className="size-4" aria-hidden="true" />
                      <span className="sr-only">View on website</span>
                    </Button>
                  )}
                  <Button size="sm" variant="outline" to={`/admin/projects/${p._id}`} icon={Pencil}>
                    Edit
                  </Button>
                  <ConfirmButton
                    size="sm"
                    variant="ghost"
                    className="text-red-600"
                    title="Delete project?"
                    message={`"${p.title}" and its uploaded photos will be permanently deleted.`}
                    onConfirm={() => remove(p)}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    <span className="sr-only">Delete</span>
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
