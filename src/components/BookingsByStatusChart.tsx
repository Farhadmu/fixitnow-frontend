"use client";

import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Booking } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  REQUESTED: "#F2A93B",
  ACCEPTED: "#4A6B85",
  DECLINED: "#C1502E",
  PAID: "#7C5CBF",
  IN_PROGRESS: "#4C7A5E",
  COMPLETED: "#334C63",
  CANCELLED: "#A5401F",
};

export function BookingsByStatusChart({ bookings }: { bookings: Booking[] }) {
  const counts: Record<string, number> = {};
  bookings.forEach((b) => {
    counts[b.status] = (counts[b.status] || 0) + 1;
  });

  const data = Object.entries(counts).map(([status, count]) => ({ status, count }));

  if (data.length === 0) {
    return <p className="p-6 text-center text-sm text-blueprint-500">No booking data yet to chart.</p>;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1C2B3915" />
          <XAxis dataKey="status" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} tickLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 4, border: "1px solid #1C2B3920", fontFamily: "var(--font-body)" }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || "#334C63"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}