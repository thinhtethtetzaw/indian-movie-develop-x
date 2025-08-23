import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import * as React from "react";

import { COMMON_ANIMATION_CONFIG } from "@/config/animation";
import { cn } from "@/lib/utils";

export const TAG_ANIMATION_DELAY_MULTIPLIER = 0.05;

const tagVariants = cva(
  "inline-flex items-center text-foreground justify-center rounded-full text-sm font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-glass [a&]:hover:bg-glass/90",
        active: "bg-brand-red [a&]:hover:bg-brand-red/90",
      },
      size: {
        sm: "px-4 py-2 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

function Tag({
  className,
  variant,
  size,
  asChild = false,
  index = 0,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof tagVariants> & { asChild?: boolean; index?: number }) {
  const Comp = asChild ? Slot : "span";

  return (
    <motion.div
      initial={COMMON_ANIMATION_CONFIG.tag.initial}
      animate={COMMON_ANIMATION_CONFIG.tag.animate}
      whileTap={props.onClick ? COMMON_ANIMATION_CONFIG.tag.tap : undefined}
      transition={{
        ...COMMON_ANIMATION_CONFIG.tag.transition,
        delay: index * TAG_ANIMATION_DELAY_MULTIPLIER,
      }}
    >
      <Comp
        data-slot="badge"
        className={cn(tagVariants({ variant, size }), className)}
        {...props}
      />
    </motion.div>
  );
}

const TagSkeleton = ({
  className,
  index = 0,
}: {
  className?: string;
  index: number;
}) => (
  <motion.div
    initial={COMMON_ANIMATION_CONFIG.tag.initial}
    animate={COMMON_ANIMATION_CONFIG.tag.animate}
    transition={{
      ...COMMON_ANIMATION_CONFIG.tag.transition,
      delay: index * TAG_ANIMATION_DELAY_MULTIPLIER,
    }}
  >
    <div
      className={cn(
        "h-12 w-24 animate-pulse rounded-full bg-white/8",
        className,
      )}
    />
  </motion.div>
);

export { Tag, TagSkeleton, tagVariants };
