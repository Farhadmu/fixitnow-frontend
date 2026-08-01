"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Calendar, Star } from "lucide-react";
import type { Booking } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";
import { BookingProgress } from "@/components/BookingProgress";
import { Button } from "@/components/ui/Button";
import { ReviewForm } from "@/components/ReviewForm";
import { useCancelBooking } from "@/hooks/useBookings";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export function CustomerBookingCard({ booking }: { booking: Booking }) {
  const [showReview, setShowReview] = useState(false);
  const cancelBooking = useCancelBooking();

  const canCancel = ["REQUESTED", "ACCEPTED", "PAID"].includes(booking.status);
  const canPay = booking.status === "ACCEPTED";
  const canReview = booking.status === "COMPLETED" && !booking.review;

  return (
    <div className="ticket-perforation rounded-ticket border border-blueprint-800/10 bg-paper-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-display font-semibold text-blueprint-900">{booking.service?.title || "Service"}</h3>
          <p className="text-xs text-blueprint-500">{booking.technician?.user?.name}</p>
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
          {canPay && (
            <Link href={`/dashboard/customer/bookings/${booking.id}/pay`}>
              <Button size="sm">Pay now</Button>
            </Link>
          )}
          {canCancel && (
            <Button size="sm" variant="outline" isLoading={cancelBooking.isPending} onClick={() => cancelBooking.mutate(booking.id)}>
              Cancel
            </Button>
          )}
          {canReview && !showReview && (
            <Button size="sm" variant="secondary" onClick={() => setShowReview(true)}>
              <Star className="h-3.5 w-3.5" />
              Leave review
            </Button>
          )}
        </div>
      </div>

      {booking.review && (
        <div className="mt-3 rounded-ticket bg-blueprint-800/5 p-3 text-xs text-blueprint-600">
          You rated this job {booking.review.rating}/5{booking.review.comment ? ` — "${booking.review.comment}"` : ""}
        </div>
      )}

      {showReview && !booking.review && (
        <div className="mt-3">
          <ReviewForm bookingId={booking.id} onDone={() => setShowReview(false)} />
        </div>
      )}
    </div>
  );
}
