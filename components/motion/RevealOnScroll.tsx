'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { EASE_OUT_EXPO, REVEAL_DURATION, STAGGER_DELAY } from '@/lib/motion';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  stagger?: boolean;
  once?: boolean;
  amount?: number;
}

export default function RevealOnScroll({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = REVEAL_DURATION,
  stagger = false,
  once = true,
  amount = 0.2,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  const directionOffset = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: -40, y: 0 },
    right: { x: 40, y: 0 },
    none: { x: 0, y: 0 },
  };

  const offset = directionOffset[direction];

  if (stagger) {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: STAGGER_DELAY,
              delayChildren: delay,
            },
          },
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...offset }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, ...offset }
      }
      transition={{
        duration,
        ease: EASE_OUT_EXPO,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/** Child item for staggered reveals */
export function RevealItem({
  children,
  className = '',
  direction = 'up',
}: {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right';
}) {
  const offsets = {
    up: { y: 25, x: 0 },
    left: { x: -30, y: 0 },
    right: { x: 30, y: 0 },
  };

  const offset = offsets[direction];

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...offset },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: REVEAL_DURATION,
            ease: EASE_OUT_EXPO,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
