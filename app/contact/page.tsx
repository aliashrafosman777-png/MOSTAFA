import type { Metadata } from 'next';
import RevealOnScroll from '@/components/motion/RevealOnScroll';
import ContactCTA from '@/components/sections/ContactCTA';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Mostafa Ahmed to discuss your travel marketing project, campaign, event, or brand challenge.',
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-8 relative">
        <div
          className="absolute inset-0 bg-gradient-to-b from-carbon via-flight-950/30 to-carbon pointer-events-none"
          aria-hidden="true"
        />
        <div className="container-site relative z-10">
          <RevealOnScroll>
            <p className="text-label mb-4">Let us connect</p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h1 className="text-display-lg text-white mb-6 max-w-3xl">
              Ready to move your travel brand forward?
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="text-body-lg max-w-2xl">
              Share the route, campaign, event, or brand challenge you are
              planning. The first conversation starts with context — not a
              generic brief.
            </p>
          </RevealOnScroll>

          {/* Quick contact */}
          {siteConfig.phone && (
          <RevealOnScroll delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-line text-mist hover:text-white hover:border-mist/40 transition-all duration-300 rounded-sm text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                {siteConfig.phone}
              </a>
            </div>
          </RevealOnScroll>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <ContactCTA />
    </>
  );
}
