"use client";

import { Calendar, MapPin, User } from "lucide-react";
import type { Booking } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";
import { BookingProgress } from "@/components/BookingProgress";
import { Button } from "@/components/ui/Button";
import { useUpdateBookingStatus } from "@/hooks/useBookings";
import { formatCurrency, formatDateTime } from "@/lib/utils";

const NEXT_ACTIONS: Record<string, { label: string; next: string; variant: "primary" | "danger" | "secondary" }[]> = {
  REQUESTED: [
    { label: "Accept", next: "ACCEPTED", variant: "primary" },
    { label: "Decline", next: "DECLINED", variant: "danger" },
  ],
  PAID: [{ label: "Start job", next: "IN_PROGRESS", variant: "primary" }],
  IN_PROGRESS: [{ label: "Mark completed", next: "COMPLETED", variant: "primary" }],
};

export function TechnicianBookingRow({ booking }: { booking: Booking }) {
  const updateStatus = useUpdateBookingStatus();
  const actions = NEXT_ACTIONS[booking.status] || [];

  return (
    <div className="rounded-ticket border border-blueprint-800/10 bg-paper-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-display font-semibold text-blueprint-900">{booking.service?.title}</h3>
          <p className="flex items-center gap-1 text-xs text-blueprint-500">
            <User className="h-3.5 w-3.5" />
            {booking.customer?.name}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-blueprint-500">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {formatDateTime(booking.scheduledAt)}
        </span>
        {booking.address && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {booking.address}
          </span>
        )}
      </div>

      <div className="mt-4">
        <BookingProgress status={booking.status} />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-dashed border-blueprint-800/15 pt-3">
        <span className="font-display text-lg font-bold text-blueprint-900">{formatCurrency(booking.totalAmount)}</span>
        <div className="flex gap-2">
          {actions.map((action) => (
            <Button
              key={action.next}
              size="sm"
              variant={action.variant}
              isLoading={updateStatus.isPending && updateStatus.variables?.status === action.next}
              onClick={() => updateStatus.mutate({ id: booking.id, status: action.next })}
            >
              
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
