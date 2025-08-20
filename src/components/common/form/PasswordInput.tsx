import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EyeClosedIcon, EyeIcon } from "lucide-react";

type Props = React.ComponentProps<"input"> & {
  label?: string;
};

export const PasswordInput = React.memo(
  ({ type, label, className, ...props }: Props) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const error = props["aria-invalid"] || false;
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
      <div className="group relative">
        <Input
          ref={inputRef}
          id={props.id + (label || "")}
          type={showPassword ? "text" : "password"}
          data-slot="input"
          className={cn(
            "h-12 rounded-lg text-white",
            {
              "text-text-destructive": error,
            },
            className,
          )}
          {...props}
          value={props.value}
          onBlur={(e) => {
            if (props.disabled) return;
            props.onBlur?.(e);
          }}
        />
        <button
          tabIndex={-1}
          data-slot="show-password"
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-4 -translate-y-1/2"
        >
          {showPassword ? (
            <EyeIcon size={16} className="text-primary" />
          ) : (
            <EyeClosedIcon size={16} className="text-primary" />
          )}
        </button>
      </div>
    );
  },
);
