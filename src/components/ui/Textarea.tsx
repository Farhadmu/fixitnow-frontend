import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, error, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-ticket border bg-paper-50 px-3 py-2 text-sm text-blueprint-900 placeholder:text-blueprint-400",
        "focus:outline-none focus:ring-2 focus:ring-amber-500/60",
        error ? "border-rust-500" : "border-blueprint-800/20",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
