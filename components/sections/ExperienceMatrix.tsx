import Image from 'next/image';
import RevealOnScroll from '@/components/motion/RevealOnScroll';

export default function ExperienceMatrix() {
  return (
    <section
      id="experience"
      className="section-padding bg-ivory text-carbon"
      aria-label="Industry experience"
    >
      <div className="container-site">
        {/* Header */}
        <RevealOnScroll>
          <p className="text-label !text-flight-800 mb-4">
            Industry Experience
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <h2 className="text-display-lg !text-carbon mb-12">
            Fluent in the travel ecosystem.
          </h2>
        </RevealOnScroll>

        {/* Experience Image */}
        <RevealOnScroll delay={0.2}>
          <Image
            src="/assets/brand/experience-matrix.jpg"
            alt="Industry experience overview — airline representation, route marketing, travel agencies and B2B systems"
            width={1920}
            height={1080}
            sizes="90vw"
            className="w-full h-auto rounded-sm"
          />
        </RevealOnScroll>
      </div>
    </section>
  );
}
