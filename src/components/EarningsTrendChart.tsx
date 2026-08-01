"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Booking } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function EarningsTrendChart({ bookings }: { bookings: Booking[] }) {
  const completed = bookings
    .filter((b) => b.status === "COMPLETED")
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  if (completed.length === 0) {
    return <p className="p-6 text-center text-sm text-blueprint-500">No completed jobs yet — earnings will chart here.</p>;
  }

  let running = 0;
  const data = completed.map((b) => {
    running += b.totalAmount;
    return {
      date: new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      cumulative: running,
    };
  });

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1C2B3915" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} tickLine={false} />
          <YAxis
            tickFormatter={(v) => formatCurrency(v)}
            width={70}
            tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{ fontSize: 12, borderRadius: 4, border: "1px solid #1C2B3920", fontFamily: "var(--font-body)" }}
          />
          <Line type="monotone" dataKey="cumulative" stroke="#F2A93B" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}