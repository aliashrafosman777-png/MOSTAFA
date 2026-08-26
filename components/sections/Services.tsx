'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { services } from '@/content/services';
import { EASE_OUT_EXPO } from '@/lib/motion';
import RevealOnScroll from '@/components/motion/RevealOnScroll';

const serviceImages = [
  '/assets/work/identity-airport-billboard.png',
  '/assets/brand/aviation-campaign-01.jpg',
  '/assets/work/identity-services.png',
  '/assets/brand/aviation-campaign-03.jpg',
  '/assets/work/identity-signage.png',
  '/assets/work/identity-luggage.png',
];

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="services"
      className="section-padding bg-obsidian relative"
      aria-label="Capabilities"
    >
      {/* Subtle green atmosphere */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-flight-950/50 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="container-site relative z-10">
        {/* Header */}
        <RevealOnScroll>
          <p className="text-label mb-4">Capabilities</p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <h2 className="text-display-lg text-white mb-4">
            One partner from message to market.
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.2}>
          <p className="text-body-lg mb-16 max-w-2xl">
            A focused mix of strategy, creative, production, and on-ground
            execution for the travel industry.
          </p>
        </RevealOnScroll>

        {/* Services Grid - Vertical accordion with changing panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Service List */}
          <div className="lg:col-span-6">
            <div className="space-y-0">
              {services.map((service, index) => (
                <RevealOnScroll key={service.id} delay={index * 0.05}>
                  <button
                    onClick={() => setActiveIndex(index)}
                    className={`w-full text-left py-6 border-b border-line transition-all duration-500 group ${
                      activeIndex === index ? 'border-runway/40' : ''
                    }`}
                    aria-expanded={activeIndex === index}
                    aria-controls={`service-panel-${service.id}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span
                            className={`text-xs font-mono tracking-wider transition-colors duration-300 ${
                              activeIndex === index
                                ? 'text-runway'
                                : 'text-sage/60'
                            }`}
                          >
                            {service.icon}
                          </span>
                          <h3
                            className={`text-lg font-semibold transition-colors duration-300 ${
                              activeIndex === index
                                ? 'text-white'
                                : 'text-mist group-hover:text-white'
                            }`}
                          >
                            {service.title}
                          </h3>
                        </div>

                        <AnimatePresence mode="wait">
                          {activeIndex === index && (
                            <motion.p
                              id={`service-panel-${service.id}`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{
                                duration: 0.4,
                                ease: EASE_OUT_EXPO,
                              }}
                              className="text-sm text-mist/80 leading-relaxed pl-10 overflow-hidden"
                            >
                              {service.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Arrow indicator */}
                      <div
                        className={`mt-1 transition-transform duration-300 ${
                          activeIndex === index ? 'rotate-45' : ''
                        }`}
                      >
                        <svg
                          className="w-4 h-4 text-sage"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          {/* Visual Panel */}
          <div className="lg:col-span-6 hidden lg:block">
            <div className="sticky top-32">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{
                      duration: 0.6,
                      ease: EASE_OUT_EXPO,
                    }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={serviceImages[activeIndex]}
                      alt={`Visual for ${services[activeIndex].title}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon/50 to-transparent" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
