import * as React from "react";

import { cn } from "@/lib/utils";

function TextareaInput({
  className,
  label,
  ...props
}: React.ComponentProps<"textarea"> & {
  label?: string;
}) {
  return (
    <textarea
      id={props.id}
      data-slot="textarea"
      className={cn(
        "text-body-sm border-input-border-primaryDefault placeholder:text-body-sm! placeholder:leading-body-sm placeholder:text-text-inactive hover:border-input-border-primaryHover bg-input-bg-default focus-visible:border-input-border-primaryHover focus-visible:ring-effect-ring-primary aria-invalid:focus-visible:ring-effect-ring-destructive aria-invalid:focus-visible:border-input-border-destructiveHover aria-invalid:ring-ring-destructive aria-invalid:border-input-border-destructiveDefault aria-invalid:hover:border-input-border-destructiveHover disabled:border-input-border-primaryDefault disabled:bg-input-bg-inactive flex field-sizing-content min-h-16 w-full rounded-lg border px-3 py-2 shadow-xs transition-[color,box-shadow] outline-none placeholder:font-medium focus-visible:ring-[2px] disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

export default TextareaInput;
