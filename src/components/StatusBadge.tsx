import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/types";

const STATUS_STYLES: Record<BookingStatus, string> = {
  REQUESTED: "bg-amber-500/10 text-amber-700 border-amber-500/40",
  ACCEPTED: "bg-blue-500/10 text-blue-700 border-blue-500/40",
  DECLINED: "bg-rust-500/10 text-rust-600 border-rust-500/40",
  PAID: "bg-purple-500/10 text-purple-700 border-purple-500/40",
  IN_PROGRESS: "bg-moss-500/10 text-moss-600 border-moss-500/40",
  COMPLETED: "bg-blueprint-500/10 text-blueprint-600 border-blueprint-500/40",
  CANCELLED: "bg-rust-700/10 text-rust-700 border-rust-700/40",
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  REQUESTED: "Requested",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  PAID: "Paid",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function StatusBadge({ status, className }: { status: BookingStatus; className?: string }) {
  return (
    <span className={cn("status-badge", STATUS_STYLES[status], className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}
