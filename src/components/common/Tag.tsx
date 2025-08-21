import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const tagVariants = cva(
  "inline-flex items-center text-foreground justify-center rounded-full text-sm font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-glass [a&]:hover:bg-glass/90",
        active: "bg-brand-red [a&]:hover:bg-brand-red/90",
      },
      size: {
        sm: "px-4 py-1",
        md: "px-5 py-2",
        lg: "px-6 py-3",
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
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof tagVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(tagVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Tag, tagVariants };
