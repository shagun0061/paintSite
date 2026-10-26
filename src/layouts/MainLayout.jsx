import { Outlet } from 'react-router';
import { Footer } from '../components/layout/Footer.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { JsonLd } from '../components/layout/Seo.jsx';
import { WhatsAppFloat } from '../components/layout/WhatsAppFloat.jsx';
import { SITE_URL } from '../config/site.js';
import { useSettings } from '../context/SettingsContext.jsx';
import { buildBusinessJsonLd } from '../utils/structuredData.js';

export function MainLayout() {
  const { settings } = useSettings();
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main id="main" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
      <JsonLd id="ld-business" data={buildBusinessJsonLd(settings, SITE_URL)} />
    </div>
  );
}
