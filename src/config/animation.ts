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

export const BOOKMARKS_ANIMATION_CONFIG = {
  selectionIndicator: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  },
  checkIcon: {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    exit: { scale: 0, rotate: 180 },
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  bottomDrawer: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
} as const;
