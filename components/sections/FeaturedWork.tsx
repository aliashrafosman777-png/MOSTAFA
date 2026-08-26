'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { getFeaturedProjects } from '@/content/projects';
import { EASE_OUT_EXPO } from '@/lib/motion';
import RevealOnScroll from '@/components/motion/RevealOnScroll';

export default function FeaturedWork() {
  const projects = getFeaturedProjects().slice(0, 4);

  return (
    <section className="section-padding" aria-label="Selected work">
      <div className="container-site">
        <RevealOnScroll>
          <p className="text-label mb-4">Selected Work</p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <h2 className="text-display-lg text-white mb-4">
            Built for real travel moments.
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.2}>
          <p className="text-body-lg mb-16 max-w-2xl">
            From inaugural flights and exhibition booths to route campaigns and
            B2B platforms — connecting strategy with visible, physical execution.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>

        <RevealOnScroll delay={0.3}>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm font-medium text-runway hover:text-white transition-colors duration-300"
          >
            View all projects
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: ReturnType<typeof getFeaturedProjects>[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: EASE_OUT_EXPO }}
    >
      <Link href={`/work/${project.slug}`} className="block relative overflow-hidden rounded-sm">
        <div className="relative overflow-hidden">
          <Image
            src={project.heroImage.src}
            alt={project.heroImage.alt}
            width={project.heroImage.width}
            height={project.heroImage.height}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-auto transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon/80 via-carbon/20 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-3">
            {project.categories.map((cat) => (
              <span key={cat} className="text-xs font-medium text-sage tracking-wider uppercase">{cat}</span>
            ))}
          </div>
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 group-hover:text-runway transition-colors duration-300">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 text-mist group-hover:text-runway transition-all duration-300">
            <span className="text-sm">View project</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
