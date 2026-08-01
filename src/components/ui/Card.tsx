import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-ticket border border-blueprint-800/10 bg-paper-50 shadow-sm", className)}
      {...props}
    />
  );
}
