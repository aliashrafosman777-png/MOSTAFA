'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '@/types';
import { EASE_OUT_EXPO } from '@/lib/motion';

interface WorkGridProps {
  projects: Project[];
  categories: string[];
}

export default function WorkGrid({ projects, categories }: WorkGridProps) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredProjects = (() => {
    if (activeFilter === 'All') return projects;
    return projects.filter((p) => {
      if (activeFilter === 'Campaigns') return p.filterCategory === 'Campaigns';
      if (activeFilter === 'Events') return p.filterCategory === 'Events';
      if (activeFilter === 'Print') return p.categories.includes('Print');
      if (activeFilter === 'B2B Systems') return p.filterCategory === 'B2B Systems';
      if (activeFilter === 'Booths') return p.filterCategory === 'Booths';
      if (activeFilter === 'Social') return p.categories.includes('Social');
      return true;
    });
  })();

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-12" role="tablist" aria-label="Filter projects by category">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            role="tab"
            aria-selected={activeFilter === category}
            aria-controls="project-grid"
            className={`px-4 py-2 text-sm font-medium tracking-wide rounded-sm transition-all duration-300 ${
              activeFilter === category
                ? 'bg-white text-carbon'
                : 'text-mist border border-line hover:border-mist/40 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div id="project-grid" role="tabpanel" className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            >
              <Link href={`/work/${project.slug}`} className="group block relative overflow-hidden rounded-sm">
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
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.categories.map((cat) => (
                      <span key={cat} className="text-xs font-medium text-sage tracking-wider uppercase">{cat}</span>
                    ))}
                  </div>
                  <h2 className="text-lg font-semibold text-white group-hover:text-runway transition-colors duration-300">
                    {project.title}
                  </h2>
                  <p className="text-sm text-mist/70 mt-1 line-clamp-2">{project.shortDescription}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProjects.length === 0 && (
        <p className="text-center text-mist py-16">No projects found in this category.</p>
      )}
    </>
  );
}
