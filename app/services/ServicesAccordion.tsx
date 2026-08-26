'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Service } from '@/types';
import { EASE_OUT_EXPO } from '@/lib/motion';
import RevealOnScroll from '@/components/motion/RevealOnScroll';

interface ServicesAccordionProps {
  services: Service[];
}

export default function ServicesAccordion({ services }: ServicesAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="max-w-3xl">
      {services.map((service, index) => (
        <RevealOnScroll key={service.id} delay={index * 0.05}>
          <button
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            className="w-full text-left py-7 border-b border-line transition-all duration-500 group"
            aria-expanded={openIndex === index}
            aria-controls={`service-detail-${service.id}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-5 mb-1">
                  <span
                    className={`text-xs font-mono tracking-wider transition-colors duration-300 ${
                      openIndex === index ? 'text-runway' : 'text-sage/60'
                    }`}
                  >
                    {service.icon}
                  </span>
                  <h3
                    className={`text-xl font-semibold transition-colors duration-300 ${
                      openIndex === index
                        ? 'text-white'
                        : 'text-mist group-hover:text-white'
                    }`}
                  >
                    {service.title}
                  </h3>
                </div>

                <AnimatePresence mode="wait">
                  {openIndex === index && (
                    <motion.div
                      id={`service-detail-${service.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                      className="overflow-hidden"
                    >
                      <p className="text-body pl-11 pt-3">
                        {service.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div
                className={`mt-2 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-45' : ''
                }`}
              >
                <svg
                  className="w-4 h-4 text-sage"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
          </button>
        </RevealOnScroll>
      ))}
    </div>
  );
}
