import { useSearchParams } from 'react-router';
import { ContactDetails, MapEmbed } from '../components/ContactDetails.jsx';
import { EnquiryForm } from '../components/EnquiryForm.jsx';
import { Seo } from '../components/layout/Seo.jsx';
import { PageHero } from '../components/PageHero.jsx';
import { SITE_IMAGES } from '../config/site.js';
import { useSettings } from '../context/SettingsContext.jsx';

export default function Contact() {
  const { settings } = useSettings();
  const [params] = useSearchParams();
  const type = params.get('type') === 'contact' ? 'contact' : 'quote';
  const service = (params.get('service') || '').slice(0, 100);

  return (
    <>
      <Seo
        title="Contact Us & Free Quote"
        description={`Request a free painting quote or get in touch with ${settings.businessName} by phone, WhatsApp or our contact form.`}
      />
      <PageHero
        eyebrow="Contact"
        title="Get your free painting quote"
        description="Fill in the form and we'll get back to you to arrange a free site visit — or message us on WhatsApp for a quicker reply."
        image={SITE_IMAGES.contact}
        breadcrumb={[{ label: 'Contact' }]}
      />

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="min-w-0 lg:col-span-2">
            <h2 className="text-2xl font-semibold">Contact details</h2>
            <div className="mt-6">
              <ContactDetails />
            </div>
          </div>
          <div id="enquiry" className="min-w-0 scroll-mt-28 lg:col-span-3">
            <div className="card p-6 sm:p-8">
              <h2 className="text-2xl font-semibold">Send us your enquiry</h2>
              <p className="mt-2 mb-6 text-navy-600">Fields marked * are required.</p>
              <EnquiryForm defaultType={type} defaultService={service} />
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Map" className="bg-beige-50">
        <MapEmbed className="block h-[380px] w-full border-0 grayscale-[30%] sm:h-[460px]" />
      </section>
    </>
  );
}
