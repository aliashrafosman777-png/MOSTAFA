import Image from 'next/image';
import RevealOnScroll from '@/components/motion/RevealOnScroll';

const panels = [
  { src: '/assets/brand/meet-panel.png', alt: 'Meet — cockpit view with runway lights, part one of the brand identity reveal', w: 1080, h: 1350 },
  { src: '/assets/brand/the-panel.png', alt: 'The — continuation of the cockpit brand sequence, part two', w: 1080, h: 1350 },
  { src: '/assets/brand/branding-panel.png', alt: 'Branding — final panel of the brand identity reveal sequence', w: 1080, h: 1350 },
];

export default function MeetTheBranding() {
  return (
    <section className="section-padding bg-carbon" aria-label="Meet the Branding — brand identity sequence">
      <div className="container-site">
        <RevealOnScroll>
          <p className="text-label mb-12 text-center">Identity</p>
        </RevealOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {panels.map((panel, index) => (
            <RevealOnScroll key={panel.src} delay={index * 0.15} direction="up">
              <div className="group overflow-hidden rounded-sm">
                <Image
                  src={panel.src}
                  alt={panel.alt}
                  width={panel.w}
                  height={panel.h}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-auto transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.02]"
                />
              </div>
            </RevealOnScroll>
          ))}
        </div>
        <RevealOnScroll delay={0.5}>
          <div className="runway-line mt-16 max-w-md mx-auto" aria-hidden="true" />
        </RevealOnScroll>
      </div>
    </section>
  );
}
