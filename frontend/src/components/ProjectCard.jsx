import { ArrowUpRight, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import { formatDate } from '../utils/format.js';
import { Badge } from './ui/Badge.jsx';
import { ResponsiveImage } from './ui/ResponsiveImage.jsx';

export function ProjectCard({ project, headingLevel: H = 'h3' }) {
  const hasBeforeAfter = project.beforeImage?.url && project.afterImage?.url;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-navy-100 transition-shadow duration-300 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-beige-100">
        <ResponsiveImage
          image={project.coverImage}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge tone="neutral" className="bg-white/95 ring-0 backdrop-blur">
            {project.category}
          </Badge>
          {hasBeforeAfter && (
            <Badge tone="accent" className="bg-accent-600 text-white ring-0">
              Before & after
            </Badge>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <H className="text-lg font-semibold">
          <Link to={`/portfolio/${project.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {project.title}
          </Link>
        </H>
        {project.summary && <p className="mt-2 line-clamp-2 flex-1 text-[15px] leading-relaxed text-navy-600">{project.summary}</p>}
        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-navy-500">
          <span className="flex items-center gap-1.5">
            {project.location && (
              <>
                <MapPin className="size-4" aria-hidden="true" />
                {project.location}
              </>
            )}
          </span>
          {project.completedAt && <time dateTime={project.completedAt}>{formatDate(project.completedAt, { month: 'short', year: 'numeric' })}</time>}
        </div>
      </div>
      <span className="pointer-events-none absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full bg-white/95 text-navy-900 opacity-0 shadow-soft transition-opacity group-hover:opacity-100 group-has-focus-visible:opacity-100">
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </span>
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-accent-500 group-has-focus-visible:ring-2" aria-hidden="true" />
    </article>
  );
}
