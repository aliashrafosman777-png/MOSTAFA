/** Motion system constants for the cinematic aviation-luxury direction */

/** Primary easing — smooth aircraft-like movement */
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Standard reveal duration in seconds */
export const REVEAL_DURATION = 0.75;

/** Stagger delay between sequential elements */
export const STAGGER_DELAY = 0.1;

/** Fade-up reveal variant */
export const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: REVEAL_DURATION,
      ease: EASE_OUT_EXPO,
    },
  },
};

/** Fade-in variant (no vertical movement) */
export const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: REVEAL_DURATION,
      ease: EASE_OUT_EXPO,
    },
  },
};

/** Stagger container variant */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER_DELAY,
      delayChildren: 0.1,
    },
  },
};

/** Slide-in from left variant */
export const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: REVEAL_DURATION,
      ease: EASE_OUT_EXPO,
    },
  },
};

/** Slide-in from right variant */
export const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: REVEAL_DURATION,
      ease: EASE_OUT_EXPO,
    },
  },
};

/** Scale-up reveal for images */
export const scaleUpVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: EASE_OUT_EXPO,
    },
  },
};

/** Line draw variant (for runway motif) */
export const lineDrawVariant = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: EASE_OUT_EXPO,
    },
  },
};
