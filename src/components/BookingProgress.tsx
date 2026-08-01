import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/types";

const HAPPY_PATH: BookingStatus[] = ["REQUESTED", "ACCEPTED", "PAID", "IN_PROGRESS", "COMPLETED"];

const STEP_LABELS: Record<string, string> = {
  REQUESTED: "Requested",
  ACCEPTED: "Accepted",
  PAID: "Paid",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

export function BookingProgress({ status }: { status: BookingStatus }) {
  if (status === "DECLINED" || status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 rounded-ticket bg-rust-500/5 px-3 py-2 text-xs font-medium text-rust-500">
        <X className="h-3.5 w-3.5" />
        {status === "DECLINED" ? "Request declined by technician" : "Booking cancelled"}
      </div>
    );
  }

  const currentIndex = HAPPY_PATH.indexOf(status);

  return (
    <div className="flex items-center">
      {HAPPY_PATH.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold",
                  isDone && "border-moss-500 bg-moss-500 text-paper-50",
                  isCurrent && "border-amber-500 bg-amber-500 text-blueprint-950",
                  !isDone && !isCurrent && "border-blueprint-800/20 bg-paper-50 text-blueprint-300"
                )}
              >
                {isDone ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              <span
                className={cn(
                  "whitespace-nowrap text-[10px] font-mono uppercase tracking-wide",
                  isCurrent ? "text-blueprint-900" : "text-blueprint-400"
                )}
              >
                {STEP_LABELS[step]}
              </span>
            </div>
            {i < HAPPY_PATH.length - 1 && (
              <div className={cn("mx-1 h-0.5 flex-1 rounded", isDone ? "bg-moss-500" : "bg-blueprint-800/15")} />
            )}
          </div>
        );
      })}
    </div>
  );
}