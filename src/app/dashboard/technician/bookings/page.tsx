"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { RequireRole } from "@/components/RequireRole";
import { useTechnicianBookings } from "@/hooks/useBookings";
import { TechnicianBookingRow } from "@/components/TechnicianBookingRow";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/types";

const TABS: { label: string; value: BookingStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Requested", value: "REQUESTED" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Paid", value: "PAID" },
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
];

function TechnicianBookingsContent() {
  const [tab, setTab] = useState<BookingStatus | "ALL">("ALL");
  const { data, isLoading } = useTechnicianBookings(tab === "ALL" ? undefined : tab);
  const bookings = data?.data || [];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-blueprint-900">Job requests</h1>
      <p className="mt-1 text-sm text-blueprint-500">Accept, decline, and track jobs through completion.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium",
              tab === t.value
                ? "border-amber-500 bg-amber-500/10 text-blueprint-900"
                : "border-blueprint-800/15 text-blueprint-500 hover:border-blueprint-800/30"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        {!isLoading && bookings.length === 0 && (
          <EmptyState icon={ClipboardList} title="No bookings here" description="Try a different filter tab." />
        )}
        {!isLoading && bookings.map((b) => <TechnicianBookingRow key={b.id} booking={b} />)}
      </div>
    </div>
  );
}

export default function TechnicianBookingsPage() {
  return (
    <RequireRole role="TECHNICIAN">
      <TechnicianBookingsContent />
    </RequireRole>
  );
}
