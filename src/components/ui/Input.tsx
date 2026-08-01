import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-ticket border bg-paper-50 px-3 text-sm text-blueprint-900 placeholder:text-blueprint-400",
        "focus:outline-none focus:ring-2 focus:ring-amber-500/60",
        error ? "border-rust-500" : "border-blueprint-800/20",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
