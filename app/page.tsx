import Link from 'next/link';
import Hero from '@/components/sections/Hero';
import ExperienceRail from '@/components/sections/ExperienceRail';
import PositioningStatement from '@/components/sections/PositioningStatement';
import FeaturedWork from '@/components/sections/FeaturedWork';
import MeetTheBranding from '@/components/sections/MeetTheBranding';
import RevealOnScroll from '@/components/motion/RevealOnScroll';
import { services } from '@/content/services';

export default function Home() {
  return (
    <>
      <Hero />
      <ExperienceRail />
      <PositioningStatement />
      <FeaturedWork />

      {/* Services Preview — links to /services */}
      <section className="section-padding bg-obsidian relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-flight-950/50 to-transparent pointer-events-none" aria-hidden="true" />
        <div className="container-site relative z-10">
          <RevealOnScroll>
            <p className="text-label mb-4">Capabilities</p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h2 className="text-display-lg text-white mb-4">
              One partner from message to market.
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="text-body-lg mb-12 max-w-2xl">
              A focused mix of strategy, creative, production, and on-ground
              execution for the travel industry.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service, i) => (
              <RevealOnScroll key={service.id} delay={i * 0.06}>
                <div className="py-6 border-t border-line">
                  <span className="text-xs font-mono text-sage/60 tracking-wider">
                    {service.icon}
                  </span>
                  <h3 className="text-lg font-semibold text-white mt-2 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-mist/80 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={0.4}>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-medium text-runway hover:text-white transition-colors duration-300"
            >
              View all services
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      <MeetTheBranding />

      {/* Founder Preview — links to /about */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 glow-green pointer-events-none" aria-hidden="true" />
        <div className="container-site relative z-10">
          <div className="max-w-3xl">
            <RevealOnScroll>
              <p className="text-label mb-4">Founder</p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <h2 className="text-display-md text-white mb-6">
                Industry experience, translated into sharper creative decisions.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll delay={0.2}>
              <p className="text-body mb-8">
                Mostafa Ahmed is a marketing travel consultant with hands-on
                experience across global airlines, airline representation,
                travel networks, B2B systems, events, and campaign execution.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.3}>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-medium text-runway hover:text-white transition-colors duration-300"
              >
                Read the full story
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Contact CTA — links to /contact */}
      <section className="section-padding border-t border-line relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-carbon via-flight-950/30 to-carbon pointer-events-none" aria-hidden="true" />
        <div className="container-site relative z-10 text-center">
          <RevealOnScroll>
            <p className="text-label mb-4">Ready for Takeoff?</p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h2 className="text-display-lg text-white mb-6">
              Let us move your travel brand forward.
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="text-body mx-auto text-center mb-10">
              Share the route, campaign, event, or brand challenge you are
              planning. The first conversation starts with context.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.3}>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-carbon font-semibold text-sm tracking-wide hover:bg-ivory transition-colors duration-300 rounded-sm"
            >
              Start a project
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
