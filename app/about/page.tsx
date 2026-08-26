import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import RevealOnScroll from '@/components/motion/RevealOnScroll';
import ExperienceMatrix from '@/components/sections/ExperienceMatrix';
import Values from '@/components/sections/Values';
import VideoPlayer from '@/components/ui/VideoPlayer';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Mostafa Ahmed is a marketing travel consultant with hands-on experience across global airlines, airline representation, travel networks, B2B systems, events, and campaign execution.',
};

export default function AboutPage() {
  return (
    <>
      {/* Founder Hero */}
      <section className="pt-32 md:pt-40 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 glow-green pointer-events-none" aria-hidden="true" />

        <div className="container-site relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Portrait */}
            <RevealOnScroll className="lg:col-span-5" direction="left">
              <Image
                src="/assets/brand/mostafa-portrait.jpg"
                alt="Mostafa Ahmed — Founder and Marketing Travel Consultant, wearing a tailored black double-breasted blazer"
                width={1080}
                height={1350}
                sizes="(max-width: 1024px) 80vw, 40vw"
                className="w-full h-auto rounded-sm"
                priority
              />
            </RevealOnScroll>

            {/* Bio */}
            <div className="lg:col-span-7">
              <RevealOnScroll>
                <p className="text-label mb-4">Founder</p>
              </RevealOnScroll>

              <RevealOnScroll delay={0.1}>
                <h1 className="text-display-lg text-white mb-8">
                  Industry experience, translated into sharper creative decisions.
                </h1>
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
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-[1px] bg-runway/50" aria-hidden="true" />
                  <p className="text-sm text-sage italic">
                    Focused on the details. Connected to the industry. Built for
                    the next departure.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.35}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-carbon font-semibold text-sm tracking-wide hover:bg-ivory transition-colors duration-300 rounded-sm"
                >
                  Work with Mostafa
                </Link>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Wide Shot */}
      <section className="pb-12">
        <div className="container-site">
          <RevealOnScroll>
            <Image
              src="/assets/brand/founder-story-wide.jpg"
              alt="Mostafa Ahmed in a wider professional setting"
              width={1080}
              height={1350}
              sizes="90vw"
              className="w-full h-auto rounded-sm"
            />
          </RevealOnScroll>
        </div>
      </section>

      {/* Experience Matrix */}
      <ExperienceMatrix />

      {/* Values */}
      <Values />

      {/* Story Gallery */}
      <section className="section-padding border-t border-line">
        <div className="container-site">
          <RevealOnScroll>
            <p className="text-label mb-8">The Story</p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                src: '/assets/brand/founder-story-01.jpg',
                alt: 'Mostafa Ahmed — professional portrait, first',
              },
              {
                src: '/assets/brand/founder-story-02.jpg',
                alt: 'Mostafa Ahmed — professional portrait, second',
              },
              {
                src: '/assets/brand/founder-story-03.jpg',
                alt: 'Mostafa Ahmed — professional portrait, third',
              },
            ].map((img, i) => (
              <RevealOnScroll key={img.src} delay={i * 0.12}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={1080}
                  height={1350}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-auto rounded-sm"
                />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Video + Quote Two-Column Layout */}
      <section className="section-padding bg-obsidian">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left: Video (7 columns on desktop) */}
            <RevealOnScroll className="lg:col-span-7" direction="left">
              <VideoPlayer
                src="/assets/video/travel-marketing.mp4"
                poster="/assets/video/travel-marketing-poster.jpg"
                ariaLabel="Travel marketing showreel"
              />
            </RevealOnScroll>

            {/* Right: Quote + CTA (5 columns on desktop) */}
            <div className="lg:col-span-5">
              <RevealOnScroll direction="right" delay={0.15}>
                <blockquote className="text-editorial text-ivory mb-10 max-w-md">
                  Watch how strategy, story, and experience come together to
                  take travel marketing beyond visibility.
                </blockquote>
              </RevealOnScroll>
              <RevealOnScroll direction="right" delay={0.25}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-carbon font-semibold text-sm tracking-wide hover:bg-ivory transition-colors duration-300 rounded-sm"
                >
                  Start a conversation
                </Link>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
