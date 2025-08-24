import { COMMON_ANIMATION_CONFIG } from "@/config/animation";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = "",
  direction = "right",
}) => {
  const getAnimationConfig = () => {
    switch (direction) {
      case "left":
        return {
          initial: { x: "-100%", opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: "100%", opacity: 0 },
        };
      case "right":
        return {
          initial: { x: "100%", opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: "-100%", opacity: 0 },
        };
      case "up":
        return {
          initial: { y: "100%", opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: "-100%", opacity: 0 },
        };
      case "down":
        return {
          initial: { y: "-100%", opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: "100%", opacity: 0 },
        };
      default:
        return COMMON_ANIMATION_CONFIG.pageTransition;
    }
  };

  const animationConfig = getAnimationConfig();

  return (
    <motion.div
      initial={animationConfig.initial}
      animate={animationConfig.animate}
      exit={animationConfig.exit}
      transition={COMMON_ANIMATION_CONFIG.pageTransition.transition}
      className={`h-full w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
