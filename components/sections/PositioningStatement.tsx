import Image from 'next/image';
import RevealOnScroll from '@/components/motion/RevealOnScroll';

export default function PositioningStatement() {
  return (
    <section className="section-padding relative overflow-hidden" aria-label="Positioning">
      <div className="absolute inset-0 glow-green-subtle pointer-events-none" aria-hidden="true" />
      <div className="container-site relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6">
            <RevealOnScroll>
              <blockquote className="text-editorial text-ivory mb-8">
                Travel marketing is more than visibility. It is the moment
                strategy, story, and experience align.
              </blockquote>
            </RevealOnScroll>
            <RevealOnScroll delay={0.15}>
              <p className="text-body-lg">
                With hands-on experience across airline representation, travel
                networks, B2B systems, events, and campaign production, Mostafa
                brings industry understanding to every creative decision.
              </p>
            </RevealOnScroll>
          </div>
          <RevealOnScroll className="lg:col-span-6" direction="right">
            <Image
              src="/assets/brand/aviation-campaign-02.jpg"
              alt="Cockpit view of an aircraft at night — a finished campaign artwork from the portfolio"
              width={1080}
              height={1350}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full h-auto rounded-sm"
              loading="eager"
            />
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
