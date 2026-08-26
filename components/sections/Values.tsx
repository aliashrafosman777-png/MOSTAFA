import type { Value } from '@/types';
import RevealOnScroll from '@/components/motion/RevealOnScroll';

const values: Value[] = [
  {
    title: 'Credibility',
    description:
      'Clear commitments and consistent delivery build lasting trust.',
  },
  {
    title: 'Precision',
    description:
      'Every message, asset, and environment is treated as part of one brand experience.',
  },
  {
    title: 'Partnership',
    description:
      'The best work comes from close collaboration and shared ambition.',
  },
];

export default function Values() {
  return (
    <section className="section-padding border-t border-line" aria-label="Values">
      <div className="container-site">
        <RevealOnScroll>
          <h2 className="text-display-md text-white mb-16 text-center">
            The standard behind the work.
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {values.map((value, index) => (
            <RevealOnScroll key={value.title} delay={index * 0.12}>
              <div className="text-center md:text-left">
                {/* Number accent */}
                <span
                  className="inline-block text-xs font-mono text-sage/50 tracking-widest mb-4"
                  aria-hidden="true"
                >
                  0{index + 1}
                </span>

                <h3 className="text-lg font-semibold text-white mb-3">
                  {value.title}
                </h3>

                <div className="w-8 h-[1px] bg-runway/40 mb-4 mx-auto md:mx-0" aria-hidden="true" />

                <p className="text-sm text-mist leading-relaxed">
                  {value.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
