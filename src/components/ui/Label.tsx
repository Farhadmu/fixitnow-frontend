import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-xs font-mono uppercase tracking-wide text-blueprint-600", className)}
      {...props}
    />
  );
}
