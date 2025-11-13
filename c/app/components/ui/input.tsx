"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-2xl border bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30",
          hasError
            ? "border-rose-400 focus:border-rose-400 focus:ring-rose-300/60"
            : "border-white/15",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

