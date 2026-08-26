'use client';

import { useState, useCallback, useRef, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import type { ProjectImage } from '@/types';
import { EASE_OUT_EXPO } from '@/lib/motion';

interface ProjectImageCarouselProps {
  images: ProjectImage[];
  projectTitle: string;
}

const SWIPE_THRESHOLD = 50;
const TRANSITION_DURATION = 0.55;

/** Reduced-motion media query hook using useSyncExternalStore */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false // SSR fallback — assume no preference
  );
}

export default function ProjectImageCarousel({
  images,
  projectTitle,
}: ProjectImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const total = images.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  const goTo = useCallback(
    (index: number, dir: number) => {
      if (isAnimating) return;
      if (index < 0 || index >= total) return;
      setDirection(dir);
      setIsAnimating(true);
      setCurrentIndex(index);
    },
    [isAnimating, total]
  );

  const goNext = useCallback(() => {
    if (!isLast) goTo(currentIndex + 1, 1);
  }, [currentIndex, isLast, goTo]);

  const goPrev = useCallback(() => {
    if (!isFirst) goTo(currentIndex - 1, -1);
  }, [currentIndex, isFirst, goTo]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          goNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goPrev();
          break;
        case 'Home':
          e.preventDefault();
          if (currentIndex !== 0) goTo(0, -1);
          break;
        case 'End':
          e.preventDefault();
          if (currentIndex !== total - 1) goTo(total - 1, 1);
          break;
      }
    },
    [goNext, goPrev, goTo, currentIndex, total]
  );

  // Swipe / drag
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { offset, velocity } = info;
      const swipe = Math.abs(offset.x) * velocity.x;

      if (offset.x < -SWIPE_THRESHOLD || swipe < -1000) {
        goNext();
      } else if (offset.x > SWIPE_THRESHOLD || swipe > 1000) {
        goPrev();
      }
    },
    [goNext, goPrev]
  );

  // Single image — no carousel controls
  if (total <= 1) {
    const img = images[0];
    if (!img) return null;
    return (
      <div className="container-site">
        <Image
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          sizes="90vw"
          className="w-full h-auto rounded-sm"
          priority
        />
      </div>
    );
  }

  const currentImage = images[currentIndex];

  // Framer Motion variants
  const slideVariants = prefersReduced
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (dir: number) => ({
          x: dir > 0 ? 80 : -80,
          opacity: 0,
        }),
        center: {
          x: 0,
          opacity: 1,
        },
        exit: (dir: number) => ({
          x: dir > 0 ? -80 : 80,
          opacity: 0,
        }),
      };

  const transition = prefersReduced
    ? { duration: 0.15 }
    : {
        x: { type: 'tween', duration: TRANSITION_DURATION, ease: EASE_OUT_EXPO },
        opacity: { duration: TRANSITION_DURATION * 0.7, ease: 'easeInOut' },
      };

  const progressPercent = ((currentIndex + 1) / total) * 100;

  return (
    <div
      ref={containerRef}
      className="container-site"
      role="region"
      aria-label={`${projectTitle} image gallery`}
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Image Stage */}
      <div className="relative overflow-hidden rounded-sm bg-flight-950">
        {/* Image container with AnimatePresence */}
        <div className="relative w-full" style={{ maxHeight: '85vh' }}>
          <AnimatePresence
            initial={false}
            custom={direction}
            mode="wait"
            onExitComplete={() => setIsAnimating(false)}
          >
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              drag={prefersReduced ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              className="w-full flex items-center justify-center"
              style={{ maxHeight: '85vh' }}
              aria-live="polite"
              role="group"
              aria-roledescription="slide"
              aria-label={`Image ${currentIndex + 1} of ${total}`}
            >
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                width={currentImage.width}
                height={currentImage.height}
                sizes="90vw"
                className="w-full h-auto"
                style={{
                  maxHeight: '85vh',
                  objectFit: 'contain',
                }}
                priority={currentIndex === 0}
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* Desktop Arrows — overlaid on left/right edges */}
          <div className="hidden md:block">
            <button
              onClick={goPrev}
              disabled={isFirst}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full 
                bg-flight-950/80 border border-line backdrop-blur-sm
                flex items-center justify-center
                transition-all duration-300
                hover:bg-flight-900 hover:border-runway/40 hover:shadow-[0_0_16px_rgba(168,195,158,0.2)]
                focus-visible:shadow-[0_0_16px_rgba(168,195,158,0.3)]
                disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-flight-950/80 disabled:hover:border-line disabled:hover:shadow-none"
            >
              <svg
                className="w-5 h-5 text-mist"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={goNext}
              disabled={isLast}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full 
                bg-flight-950/80 border border-line backdrop-blur-sm
                flex items-center justify-center
                transition-all duration-300
                hover:bg-flight-900 hover:border-runway/40 hover:shadow-[0_0_16px_rgba(168,195,158,0.2)]
                focus-visible:shadow-[0_0_16px_rgba(168,195,158,0.3)]
                disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-flight-950/80 disabled:hover:border-line disabled:hover:shadow-none"
            >
              <svg
                className="w-5 h-5 text-mist"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Controls bar — below image on all screens */}
      <div className="flex items-center justify-between mt-4 px-1">
        {/* Mobile Arrows */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={goPrev}
            disabled={isFirst}
            aria-label="Previous image"
            className="w-11 h-11 rounded-full 
              bg-flight-950 border border-line
              flex items-center justify-center
              transition-all duration-300
              hover:bg-flight-900 hover:border-runway/40 hover:shadow-[0_0_12px_rgba(168,195,158,0.15)]
              focus-visible:shadow-[0_0_12px_rgba(168,195,158,0.25)]
              disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg
              className="w-4 h-4 text-mist"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goNext}
            disabled={isLast}
            aria-label="Next image"
            className="w-11 h-11 rounded-full 
              bg-flight-950 border border-line
              flex items-center justify-center
              transition-all duration-300
              hover:bg-flight-900 hover:border-runway/40 hover:shadow-[0_0_12px_rgba(168,195,158,0.15)]
              focus-visible:shadow-[0_0_12px_rgba(168,195,158,0.25)]
              disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg
              className="w-4 h-4 text-mist"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Spacer for desktop (arrows are overlaid) */}
        <div className="hidden md:block" />

        {/* Counter */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-mist tabular-nums tracking-wide">
            {String(currentIndex + 1).padStart(2, '0')}{' '}
            <span className="text-sage/50">/</span>{' '}
            {String(total).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-[2px] bg-line/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-runway/60 rounded-full"
          initial={false}
          animate={{ width: `${progressPercent}%` }}
          transition={{
            duration: prefersReduced ? 0.1 : 0.4,
            ease: EASE_OUT_EXPO,
          }}
        />
      </div>

      {/* Screen reader live region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Image {currentIndex + 1} of {total}
      </div>
    </div>
  );
}
