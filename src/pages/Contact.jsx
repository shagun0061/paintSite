import { useSearchParams } from 'react-router';
import { ContactInfoCard, ContactOptions } from '../components/ContactDetails.jsx';
import { EnquiryForm } from '../components/EnquiryForm.jsx';
import { Seo } from '../components/layout/Seo.jsx';
import { PageHero } from '../components/PageHero.jsx';
import { SITE_IMAGES } from '../config/site.js';
import { useSettings } from '../context/SettingsContext.jsx';

const STEPS = ['Fill in your details', 'Press Send in WhatsApp or email', 'We call you to book a free site visit'];

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
        description="Call, WhatsApp or fill in the form, whichever suits you. Quotes are free and there's no obligation."
        image={SITE_IMAGES.contact}
        breadcrumb={[{ label: 'Contact' }]}
      />

      {/* Step 1: choose how to get in touch */}
      <section className="bg-beige-50 pt-14 pb-16 sm:pt-16" aria-labelledby="options-title">
        <div className="container-page">
          <h2 id="options-title" className="text-center text-2xl font-semibold sm:text-3xl">
            How would you like to reach us?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-navy-600">Pick the option that's easiest for you.</p>
          <div className="mt-10">
            <ContactOptions />
          </div>
        </div>
      </section>

      {/* Step 2: the form + details */}
      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div id="enquiry" className="min-w-0 scroll-mt-28 lg:col-span-8">
            <div className="card p-6 sm:p-10">
              <h2 className="text-2xl font-semibold sm:text-3xl">Send us your details</h2>
              <ol className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6">
                {STEPS.map((s, i) => (
                  <li key={s} className="flex items-center gap-2.5 text-sm font-medium text-navy-700">
                    <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-100 text-xs font-bold text-accent-700">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
              <hr className="my-8 border-navy-100" />
              <EnquiryForm defaultType={type} defaultService={service} />
            </div>
          </div>
          <aside className="min-w-0 lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <ContactInfoCard />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
