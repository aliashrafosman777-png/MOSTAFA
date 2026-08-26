'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Atmospheric Green Glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-flight-900/40 via-flight-950/20 to-transparent" />
        <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-t from-flight-900/30 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Animated Runway Line */}
      <motion.div
        className="absolute bottom-32 left-0 right-0 h-[1px]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: EASE_OUT_EXPO }}
        style={{ transformOrigin: 'left' }}
        aria-hidden="true"
      >
        <div className="runway-line w-full" />
      </motion.div>

      <div className="container-site relative z-10 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 xl:col-span-6">
            <motion.p
              className="text-label mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE_OUT_EXPO }}
            >
              Aviation / Travel / Brand Growth
            </motion.p>

            <motion.h1
              className="text-display-xl text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: EASE_OUT_EXPO }}
            >
              Marketing that goes beyond borders and skies.
            </motion.h1>

            <motion.p
              className="text-body-lg mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: EASE_OUT_EXPO }}
            >
              I help airlines, GSAs, travel agencies, and B2B travel platforms
              turn complex offers into clear, premium brand experiences — from
              strategy and campaigns to events, media, and print.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: EASE_OUT_EXPO }}
            >
              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-carbon font-semibold text-sm tracking-wide hover:bg-ivory transition-colors duration-300 rounded-sm"
              >
                View selected work
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-line text-white font-medium text-sm tracking-wide hover:border-mist/40 hover:bg-white/5 transition-all duration-300 rounded-sm"
              >
                Start a conversation
              </Link>
            </motion.div>
          </div>

          {/* Founder Portrait — seamless luxury presentation */}
          <motion.div
            className="lg:col-span-5 xl:col-span-6 relative flex flex-col items-center lg:items-end"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: EASE_OUT_EXPO }}
          >
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
              {/* Soft ambient background glow */}
              <div
                className="absolute -inset-6 bg-gradient-to-tr from-flight-900/40 via-flight-950/20 to-transparent rounded-3xl blur-3xl pointer-events-none"
                aria-hidden="true"
              />

              {/* Luxury framed card with smooth rounded corners on all 4 sides */}
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-carbon">
                <Image
                  src="/assets/brand/mostafa-portrait.jpg"
                  alt="Mostafa Ahmed — Marketing Travel Consultant, wearing a tailored black double-breasted blazer"
                  width={1080}
                  height={1350}
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 38vw"
                  className="w-full h-auto object-cover object-top block"
                  priority
                />
                {/* Subtle vignette blend at bottom contained cleanly within rounded card */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-carbon/80 via-carbon/20 to-transparent pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Tagline under the portrait */}
            <motion.div
              className="flex items-center gap-3 mt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.9, ease: EASE_OUT_EXPO }}
            >
              <div className="w-8 h-[1px] bg-runway/60" />
              <p className="text-sm text-sage tracking-wide">
                Mostafa Ahmed — Marketing Travel Consultant
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
