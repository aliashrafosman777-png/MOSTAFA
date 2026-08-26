'use client';

import RevealOnScroll from '@/components/motion/RevealOnScroll';

const experienceItems = [
  'Airlines',
  'GSAs',
  'Travel Agencies',
  'B2B Travel Systems',
  'Airport Activations',
  'Global Exhibitions',
];

export default function ExperienceRail() {
  return (
    <section className="py-12 border-y border-line overflow-hidden" aria-label="Selected experience">
      <div className="container-site">
        <RevealOnScroll>
          <p className="text-label mb-8 text-center">
            Selected Experience Across
          </p>
        </RevealOnScroll>
      </div>

      {/* Scrolling rail */}
      <div className="relative">
        <div
          className="flex animate-[scroll_30s_linear_infinite] gap-12 md:gap-16 whitespace-nowrap"
          aria-label="Experience categories"
        >
          {/* Duplicate for seamless loop */}
          {[...experienceItems, ...experienceItems, ...experienceItems].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="text-lg md:text-xl font-medium text-mist/60 flex-shrink-0 flex items-center gap-12 md:gap-16"
            >
              {item}
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-sage/40" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-\\[scroll_30s_linear_infinite\\] {
            animation: none !important;
            flex-wrap: wrap;
            justify-content: center;
            white-space: normal;
          }
        }
      `}</style>
    </section>
  );
}
