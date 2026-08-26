'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';

/**
 * Check sessionStorage outside of React state to avoid
 * the "setState in effect" lint warning.
 */
function getHasPlayed(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem('preloader-played') === 'true';
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export default function Preloader() {
  const alreadyPlayed = useSyncExternalStore(subscribe, getHasPlayed, () => false);
  const [isDismissed, setIsDismissed] = useState(alreadyPlayed);

  useEffect(() => {
    if (alreadyPlayed) return;

    // Auto-dismiss after animation completes
    const timer = setTimeout(() => {
      setIsDismissed(true);
      sessionStorage.setItem('preloader-played', 'true');
    }, 1200);

    // Failsafe for slow devices
    const failsafe = setTimeout(() => {
      setIsDismissed(true);
      sessionStorage.setItem('preloader-played', 'true');
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(failsafe);
    };
  }, [alreadyPlayed]);

  // Don't render at all if already played
  if (alreadyPlayed) return null;

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-carbon"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: EASE_OUT_EXPO,
          }}
          aria-hidden="true"
        >
          <div className="relative flex flex-col items-center gap-6">
            {/* Runway Line */}
            <motion.div
              className="w-32 h-[2px] bg-gradient-to-r from-transparent via-runway to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.6 }}
              transition={{
                duration: 0.8,
                ease: EASE_OUT_EXPO,
              }}
            />

            {/* Aircraft Mark */}
            <motion.svg
              viewBox="0 0 40 40"
              className="w-8 h-8 text-runway"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: EASE_OUT_EXPO,
              }}
            >
              <path
                d="M20 2 L24 14 L38 18 L24 22 L20 38 L16 22 L2 18 L16 14 Z"
                fill="currentColor"
                opacity="0.7"
              />
            </motion.svg>

            {/* Second Runway Line */}
            <motion.div
              className="w-20 h-[1px] bg-gradient-to-r from-transparent via-sage to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.4 }}
              transition={{
                duration: 0.6,
                delay: 0.4,
                ease: EASE_OUT_EXPO,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
