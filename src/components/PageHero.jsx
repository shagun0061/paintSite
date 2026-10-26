import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { ResponsiveImage } from './ui/ResponsiveImage.jsx';

/** Header band for inner pages, with breadcrumb and optional background image. */
export function PageHero({ eyebrow, title, description, image, breadcrumb = [], children }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900">
      {image && (
        <ResponsiveImage image={image} alt="" priority sizes="100vw" className="absolute inset-0 -z-10 size-full object-cover opacity-30" />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-900/90 to-navy-900/40" aria-hidden="true" />
      <div className="container-page py-16 sm:py-20 lg:py-24">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-navy-200">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>
            {breadcrumb.map((b, i) => (
              <li key={b.label} className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5" aria-hidden="true" />
                {b.to && i < breadcrumb.length - 1 ? (
                  <Link to={b.to} className="hover:text-white">
                    {b.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white">
                    {b.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <p className="eyebrow mb-3 text-accent-300">{eyebrow}</p>}
        <h1 className="max-w-3xl text-4xl font-semibold text-white sm:text-5xl">{title}</h1>
        {description && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-100">{description}</p>}
        {children}
      </div>
    </section>
  );
}
