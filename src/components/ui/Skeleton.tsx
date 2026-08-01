import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-ticket bg-blueprint-800/10", className)} />;
}

export function ServiceCardSkeleton() {
  return (
    <div className="rounded-ticket border border-blueprint-800/10 bg-paper-50 p-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="mt-3 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
      <Skeleton className="mt-4 h-8 w-full" />
    </div>
  );
}
