import type { Metadata } from 'next';
import { services } from '@/content/services';
import RevealOnScroll from '@/components/motion/RevealOnScroll';
import ServicesAccordion from './ServicesAccordion';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Travel brand strategy, campaigns, events, media production, print, and exhibition services for airlines, GSAs, and travel platforms.',
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 relative">
        <div className="absolute inset-0 glow-green-subtle pointer-events-none" aria-hidden="true" />
        <div className="container-site relative z-10">
          <RevealOnScroll>
            <p className="text-label mb-4">Capabilities</p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h1 className="text-display-lg text-white mb-6 max-w-3xl">
              One partner from message to market.
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="text-body-lg max-w-2xl">
              A focused mix of strategy, creative, production, and on-ground
              execution built specifically for the travel industry. Every
              service connects back to the same standard: clarity, precision,
              and a brand experience that arrives fully formed.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Runway Separator */}
      <div className="container-site">
        <div className="runway-line max-w-md" aria-hidden="true" />
      </div>

      {/* Services Detail */}
      <section className="section-padding">
        <div className="container-site">
          <ServicesAccordion services={services} />
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-obsidian border-t border-line">
        <div className="container-site">
          <RevealOnScroll>
            <p className="text-label mb-4">How It Works</p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h2 className="text-display-md text-white mb-16 max-w-2xl">
              Every engagement starts with context, not a template.
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              {
                step: '01',
                title: 'Discovery and Context',
                body: 'Understanding your route, campaign, event, or brand challenge through focused conversation and industry context.',
              },
              {
                step: '02',
                title: 'Strategy and Direction',
                body: 'Defining the creative direction, messaging framework, deliverables, and timeline aligned to your commercial goals.',
              },
              {
                step: '03',
                title: 'Execution and Delivery',
                body: 'End-to-end production across digital, print, and physical environments — coordinated, quality-controlled, and delivered.',
              },
            ].map((item, i) => (
              <RevealOnScroll key={item.step} delay={i * 0.1}>
                <div>
                  <span className="text-xs font-mono text-sage/50 tracking-widest mb-4 block">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <div className="w-8 h-[1px] bg-runway/40 mb-4" aria-hidden="true" />
                  <p className="text-sm text-mist leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-site text-center">
          <RevealOnScroll>
            <h2 className="text-display-md text-white mb-6">
              Ready to discuss your next project?
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-carbon font-semibold text-sm tracking-wide hover:bg-ivory transition-colors duration-300 rounded-sm"
            >
              Start a conversation
            </a>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
