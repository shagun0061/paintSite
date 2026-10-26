import { Images } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { CtaSection } from '../components/CtaSection.jsx';
import { Seo } from '../components/layout/Seo.jsx';
import { PageHero } from '../components/PageHero.jsx';
import { ProjectCard } from '../components/ProjectCard.jsx';
import { Button } from '../components/ui/Button.jsx';
import { EmptyState } from '../components/ui/States.jsx';
import { PROJECT_CATEGORIES, SITE_IMAGES } from '../config/site.js';
import { PROJECTS } from '../data/projects.js';
import { cn } from '../utils/cn.js';

const PAGE_SIZE = 9;

function ProjectGrid({ category }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const items = category ? PROJECTS.filter((p) => p.category === category) : PROJECTS;

  if (!items.length) {
    return (
      <EmptyState icon={Images} title={category ? `No ${category.toLowerCase()} projects yet` : 'No projects yet'}>
        We're adding new work regularly — check back soon or browse another category.
      </EmptyState>
    );
  }

  return (
    <>
      <p className="sr-only" aria-live="polite">
        Showing {Math.min(visible, items.length)} of {items.length} projects
      </p>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, visible).map((p) => (
          <li key={p.slug} className="animate-fade-up">
            <ProjectCard project={p} headingLevel="h2" />
          </li>
        ))}
      </ul>
      {visible < items.length && (
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Load more projects
          </Button>
        </div>
      )}
    </>
  );
}

export default function Portfolio() {
  const [params, setParams] = useSearchParams();
  const requested = params.get('category');
  const category = PROJECT_CATEGORIES.includes(requested) ? requested : '';

  const choose = (c) => {
    const next = new URLSearchParams(params);
    if (c) next.set('category', c);
    else next.delete('category');
    setParams(next, { replace: true, preventScrollReset: true });
  };

  return (
    <>
      <Seo
        title={category ? `${category} Painting Projects` : 'Our Work — Painting Portfolio'}
        description="Browse our recent interior, exterior, commercial and decorative painting projects, including before-and-after photos."
      />
      <PageHero
        eyebrow="Our work"
        title="Recent painting projects"
        description="Real results from homes and businesses we've worked on. Filter by type of work and open any project to see more photos."
        image={SITE_IMAGES.hero}
        breadcrumb={[{ label: 'Our Work' }]}
      />
      <section className="section pt-10 sm:pt-12">
        <div className="container-page">
          <div role="group" aria-label="Filter projects by category" className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
            {['', ...PROJECT_CATEGORIES].map((c) => (
              <button
                key={c || 'all'}
                type="button"
                aria-pressed={category === c}
                onClick={() => choose(c)}
                className={cn(
                  'shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors',
                  category === c ? 'bg-navy-900 text-white' : 'bg-white text-navy-700 ring-1 ring-navy-200 hover:bg-navy-50',
                )}
              >
                {c || 'All projects'}
              </button>
            ))}
          </div>
          <ProjectGrid key={category} category={category} />
        </div>
      </section>
      <CtaSection title="Like what you see?" text="Tell us about your space and we'll put together a free, no-obligation quote." />
    </>
  );
}
