"use client";

import { RequireRole } from "@/components/RequireRole";
import { useMyBookings } from "@/hooks/useBookings";
import { useMyPayments } from "@/hooks/usePayments";
import { CustomerBookingCard } from "@/components/CustomerBookingCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { CalendarCheck, CreditCard } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

function CustomerDashboardContent() {
  const { data: bookingsRes, isLoading: bookingsLoading } = useMyBookings();
  const { data: paymentsRes, isLoading: paymentsLoading } = useMyPayments();

  const bookings = bookingsRes?.data || [];
  const payments = paymentsRes?.data || [];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-blueprint-900">My bookings</h1>
        <p className="mt-1 text-sm text-blueprint-500">Track every job from request to completion.</p>

        <div className="mt-5 space-y-4">
          {bookingsLoading &&
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}

          {!bookingsLoading && bookings.length === 0 && (
            <EmptyState
              icon={CalendarCheck}
              title="No bookings yet"
              description="Browse services and book a technician to get started."
              action={
                <Link href="/services" className="text-sm font-medium text-amber-700 hover:underline">
                  Browse services
                </Link>
              }
            />
          )}

          {!bookingsLoading && bookings.map((b) => <CustomerBookingCard key={b.id} booking={b} />)}
        </div>
      </div>

      <div id="payments">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-blueprint-900">
          <CreditCard className="h-5 w-5" />
          Payment history
        </h2>

        <div className="mt-4 overflow-x-auto rounded-ticket border border-blueprint-800/10 bg-paper-50">
          {paymentsLoading && <Skeleton className="h-24 w-full" />}
          {!paymentsLoading && payments.length === 0 && (
            <p className="p-6 text-center text-sm text-blueprint-500">No payments yet.</p>
          )}
          {!paymentsLoading && payments.length > 0 && (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-blueprint-800/10 bg-blueprint-800/5 font-mono text-xs uppercase tracking-wide text-blueprint-500">
                <tr>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-blueprint-800/5 last:border-0">
                    <td className="px-4 py-3">{p.booking?.service?.title || "—"}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(p.amount)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          p.status === "COMPLETED"
                            ? "text-moss-600"
                            : p.status === "FAILED"
                              ? "text-rust-500"
                              : "text-amber-600"
                        }
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-blueprint-500">{formatDate(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomerDashboardPage() {
  return (
    <RequireRole role="CUSTOMER">
      <CustomerDashboardContent />
    </RequireRole>
  );
}
