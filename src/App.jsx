import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { ScrollToTop } from './components/layout/ScrollToTop.jsx';
import { Spinner } from './components/ui/States.jsx';
import { MainLayout } from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';

// Inner pages are split into separate chunks.
const About = lazy(() => import('./pages/About.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const Portfolio = lazy(() => import('./pages/Portfolio.jsx'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'));
const Reviews = lazy(() => import('./pages/Reviews.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Spinner className="min-h-[60vh]" />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="portfolio/:slug" element={<ProjectDetail />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
