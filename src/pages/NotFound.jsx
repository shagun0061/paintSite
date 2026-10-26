import { Home, PaintRoller } from 'lucide-react';
import { Seo } from '../components/layout/Seo.jsx';
import { Button } from '../components/ui/Button.jsx';

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <Seo title="Page not found" description="The page you were looking for could not be found." noindex />
      <PaintRoller className="size-14 text-accent-500" aria-hidden="true" />
      <p className="eyebrow mt-6">404</p>
      <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">This page needs a fresh coat</h1>
      <p className="mt-4 max-w-md text-lg text-navy-600">We couldn't find the page you were looking for. It may have moved or no longer exists.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/" icon={Home}>
          Back to home
        </Button>
        <Button to="/portfolio" variant="outline">
          View our work
        </Button>
      </div>
    </section>
  );
}
