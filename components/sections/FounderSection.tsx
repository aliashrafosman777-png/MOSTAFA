import Image from 'next/image';
import RevealOnScroll from '@/components/motion/RevealOnScroll';

export default function FounderSection() {
  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden"
      aria-label="About Mostafa Ahmed"
    >
      {/* Atmospheric background */}
      <div
        className="absolute inset-0 glow-green pointer-events-none"
        aria-hidden="true"
      />

      <div className="container-site relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Portrait */}
          <RevealOnScroll className="lg:col-span-5" direction="left">
            <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0 overflow-hidden rounded-sm">
              <Image
                src="/assets/brand/mostafa-portrait.jpg"
                alt="Mostafa Ahmed — Founder and Marketing Travel Consultant"
                fill
                sizes="(max-width: 1024px) 80vw, 40vw"
                className="object-cover object-top"
              />
              {/* Bottom gradient */}
              <div
                className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-carbon/60 to-transparent"
                aria-hidden="true"
              />
            </div>
          </RevealOnScroll>

          {/* Content */}
          <div className="lg:col-span-7">
            <RevealOnScroll>
              <p className="text-label mb-4">Founder</p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <h2 className="text-display-md text-white mb-8">
                Industry experience, translated into sharper creative decisions.
              </h2>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <div className="space-y-5 mb-10">
                <p className="text-body">
                  Mostafa Ahmed is a marketing travel consultant with hands-on
                  experience across global airlines, airline representation,
                  travel networks, B2B systems, events, and campaign execution.
                  His work connects commercial understanding with the detail and
                  discipline needed to deliver polished travel brands across
                  digital, print, and physical environments.
                </p>
                <p className="text-body">
                  His experience includes airline and GSA initiatives,
                  collaboration with travel agencies and technology platforms
                  such as NDC-X and Smart GDS, and participation in major
                  industry gatherings including ATM Dubai and JTTX Saudi Arabia.
                </p>
                <p className="text-body">
                  He believes leadership is not only about reaching the goal, but
                  helping the people and partners around the work grow with it.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.3}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-runway/50" aria-hidden="true" />
                <p className="text-sm text-sage italic">
                  Focused on the details. Connected to the industry. Built for
                  the next departure.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
