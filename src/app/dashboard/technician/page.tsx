"use client";

import Link from "next/link";
import { CalendarClock, DollarSign, Clock, ListChecks } from "lucide-react";
import { RequireRole } from "@/components/RequireRole";
import { useTechnicianBookings } from "@/hooks/useBookings";
import { TechnicianBookingRow } from "@/components/TechnicianBookingRow";
import { EarningsTrendChart } from "@/components/EarningsTrendChart";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/utils";

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-ticket border border-blueprint-800/10 bg-paper-50 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-ticket bg-blueprint-900 text-amber-500">
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 font-mono text-xs uppercase tracking-wide text-blueprint-500">{label}</p>
      <p className="font-display text-2xl font-bold text-blueprint-900">{value}</p>
    </div>
  );
}

function TechnicianOverviewContent() {
  const { data, isLoading } = useTechnicianBookings();
  const bookings = data?.data || [];

  const pending = bookings.filter((b) => b.status === "REQUESTED");
  const upcoming = bookings.filter((b) => ["ACCEPTED", "PAID"].includes(b.status));
  const completed = bookings.filter((b) => b.status === "COMPLETED");
  const earnings = completed.reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-blueprint-900">Overview</h1>
        <p className="mt-1 text-sm text-blueprint-500">Your jobs at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Clock} label="Pending requests" value={String(pending.length)} />
        <StatCard icon={CalendarClock} label="Upcoming jobs" value={String(upcoming.length)} />
        <StatCard icon={ListChecks} label="Completed jobs" value={String(completed.length)} />
        <StatCard icon={DollarSign} label="Total earnings" value={formatCurrency(earnings)} />
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-blueprint-900">Earnings trend</h2>
        <div className="mt-4 rounded-ticket border border-blueprint-800/10 bg-paper-50 p-4">
          <EarningsTrendChart bookings={bookings} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-blueprint-900">Pending requests</h2>
          <Link href="/dashboard/technician/bookings" className="text-sm font-medium text-amber-700 hover:underline">
            View all
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {isLoading && Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
          {!isLoading && pending.length === 0 && (
            <EmptyState icon={Clock} title="No pending requests" description="New booking requests will show up here." />
          )}
          {!isLoading && pending.slice(0, 3).map((b) => <TechnicianBookingRow key={b.id} booking={b} />)}
        </div>
      </div>
    </div>
  );
}

export default function TechnicianOverviewPage() {
  return (
    <RequireRole role="TECHNICIAN">
      <TechnicianOverviewContent />
    </RequireRole>
  );
}