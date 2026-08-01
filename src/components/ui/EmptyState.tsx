import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-ticket border border-dashed border-blueprint-800/20 bg-paper-50 px-6 py-16 text-center", className)}>
      <Icon className="h-10 w-10 text-blueprint-400" strokeWidth={1.5} />
      <h3 className="mt-4 font-display text-lg font-semibold text-blueprint-900">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-blueprint-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
