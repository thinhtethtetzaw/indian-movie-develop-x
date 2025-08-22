export const COMMON_ANIMATION_CONFIG = {
  videoCard: {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    exit: {
      scale: 0.8,
      opacity: 0,
      y: -10,
      rotateX: -5,
    },
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      duration: 0.3,
    },
  },
  tag: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    tap: {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 20,
      },
    },
    transition: {
      duration: 0.3,
    },
  },
} as const;
