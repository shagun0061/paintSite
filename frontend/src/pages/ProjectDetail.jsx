import { ArrowLeft, Calendar, MapPin, Tag } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { BeforeAfter } from '../components/BeforeAfter.jsx';
import { Gallery } from '../components/Gallery.jsx';
import { JsonLd, Seo } from '../components/layout/Seo.jsx';
import { ProjectCard } from '../components/ProjectCard.jsx';
import { Button } from '../components/ui/Button.jsx';
import { WhatsAppIcon } from '../components/ui/Icons.jsx';
import { ResponsiveImage } from '../components/ui/ResponsiveImage.jsx';
import { ErrorState, Spinner } from '../components/ui/States.jsx';
import { SITE_URL } from '../config/site.js';
import { useAsync } from '../hooks/useAsync.js';
import { useWhatsApp } from '../hooks/useWhatsApp.js';
import { assetUrl } from '../services/api.js';
import { fetchProject } from '../services/endpoints.js';
import { formatDate } from '../utils/format.js';
import { whatsappMessages } from '../utils/whatsapp.js';
import NotFound from './NotFound.jsx';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data, error, loading, reload } = useAsync((o) => fetchProject(slug, o), [slug]);
  const whatsapp = useWhatsApp();

  if (error?.status === 404) return <NotFound />;
  if (loading && !data) return <Spinner label="Loading project…" className="min-h-[60vh]" />;
  if (error) {
    return (
      <div className="container-page py-20">
        <ErrorState error={error} onRetry={reload} title="This project couldn't be loaded" />
      </div>
    );
  }

  const { project, related } = data;
  const hasBeforeAfter = project.beforeImage?.url && project.afterImage?.url;
  const gallery = project.gallery?.length ? project.gallery : [project.coverImage];
  const waLink = whatsapp(whatsappMessages.project(project.title));
  const paragraphs = project.description.split(/\n{2,}/).filter(Boolean);

  return (
    <>
      <Seo
        title={`${project.title}${project.location ? ` — ${project.location}` : ''}`}
        description={project.summary || paragraphs[0]?.slice(0, 160)}
        image={assetUrl(project.coverImage?.url)}
        type="article"
      />
      <JsonLd
        id="ld-breadcrumb"
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Our Work', item: `${SITE_URL}/portfolio` },
            { '@type': 'ListItem', position: 3, name: project.title, item: `${SITE_URL}/portfolio/${project.slug}` },
          ],
        }}
      />

      <article>
        <header className="bg-beige-50">
          <div className="container-page py-10 sm:py-14">
            <Link to="/portfolio" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-900">
              <ArrowLeft className="size-4" aria-hidden="true" /> All projects
            </Link>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold sm:text-5xl">{project.title}</h1>
            {project.summary && <p className="mt-4 max-w-2xl text-lg text-navy-600">{project.summary}</p>}
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-navy-700">
              <li className="flex items-center gap-2">
                <Tag className="size-4 text-accent-600" aria-hidden="true" />
                <Link to={`/portfolio?category=${project.category}`} className="font-semibold hover:underline">
                  {project.category}
                </Link>
              </li>
              {project.location && (
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 text-accent-600" aria-hidden="true" />
                  {project.location}
                </li>
              )}
              {project.completedAt && (
                <li className="flex items-center gap-2">
                  <Calendar className="size-4 text-accent-600" aria-hidden="true" />
                  Completed <time dateTime={project.completedAt}>{formatDate(project.completedAt)}</time>
                </li>
              )}
            </ul>
          </div>
        </header>

        <div className="container-page grid gap-12 py-12 lg:grid-cols-3 lg:py-16">
          <div className="space-y-12 lg:col-span-2">
            {hasBeforeAfter ? (
              <section aria-labelledby="ba-title">
                <h2 id="ba-title" className="mb-4 text-2xl font-semibold">
                  Before & after
                </h2>
                <BeforeAfter before={project.beforeImage} after={project.afterImage} title={project.title} />
              </section>
            ) : (
              <ResponsiveImage image={project.coverImage} priority sizes="(min-width: 1024px) 66vw, 100vw" className="aspect-[16/10] w-full rounded-2xl object-cover" />
            )}

            {paragraphs.length > 0 && (
              <section aria-labelledby="about-project">
                <h2 id="about-project" className="text-2xl font-semibold">
                  About this project
                </h2>
                <div className="prose-body mt-4 text-lg leading-relaxed text-navy-700">
                  {paragraphs.map((p) => (
                    <p key={p.slice(0, 40)}>{p}</p>
                  ))}
                </div>
              </section>
            )}

            <section aria-labelledby="gallery-title">
              <h2 id="gallery-title" className="mb-4 text-2xl font-semibold">
                Photo gallery
              </h2>
              <Gallery images={gallery} title={project.title} />
            </section>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card p-6">
              <h2 className="font-sans text-lg font-bold">Want a similar result?</h2>
              <p className="mt-2 text-navy-600">Get a free quote for a project like this one. We'll mention “{project.title}” so we know what you liked.</p>
              <div className="mt-5 grid gap-3">
                {waLink && (
                  <Button href={waLink} external variant="whatsapp" icon={WhatsAppIcon}>
                    Get a Quote on WhatsApp
                  </Button>
                )}
                <Button
                  to={`/contact?type=quote&service=${encodeURIComponent(`Similar to: ${project.title}`)}#enquiry`}
                  variant={waLink ? 'outline' : 'primary'}
                >
                  Request a quote by form
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {related?.length > 0 && (
        <section className="section bg-beige-50 pt-14 sm:pt-16" aria-labelledby="related-title">
          <div className="container-page">
            <h2 id="related-title" className="text-3xl font-semibold">
              More {project.category.toLowerCase()} projects
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p._id}>
                  <ProjectCard project={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
