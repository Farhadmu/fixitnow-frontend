"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Users } from "lucide-react";
import { useTechnicians } from "@/hooks/usePublicData";
import { TechnicianCard } from "@/components/TechnicianCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { Pagination } from "@/components/Pagination";

const LIMIT = 9;

export default function TechniciansPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState("");
  const [minRating, setMinRating] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useTechnicians({
    search: search || undefined,
    location: location || undefined,
    minRating: minRating || undefined,
    page,
    limit: LIMIT,
  });

  const technicians = data?.data || [];
  const total = data?.meta?.total ?? technicians.length;

  const updateFilter = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-blueprint-500">
        <Users className="h-3.5 w-3.5" />
        Vetted professionals
      </div>
      <h1 className="mt-2 font-display text-3xl font-bold text-blueprint-900">Find a technician</h1>

      <div className="sticky top-16 z-20 mt-6 grid gap-4 rounded-ticket border border-blueprint-800/10 bg-paper-50/95 p-4 shadow-sm backdrop-blur sm:grid-cols-3">
        <div>
          <Label htmlFor="search">Search by name</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blueprint-400" />
            <Input
              id="search"
              placeholder="e.g. Rahman"
              className="pl-9"
              value={search}
              onChange={(e) => updateFilter(setSearch)(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g. Dhaka"
            value={location}
            onChange={(e) => updateFilter(setLocation)(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="minRating">Minimum rating</Label>
          <Select id="minRating" value={minRating} onChange={(e) => updateFilter(setMinRating)(e.target.value)}>
            <option value="">Any rating</option>
            <option value="4">4+ stars</option>
            <option value="3">3+ stars</option>
            <option value="2">2+ stars</option>
          </Select>
        </div>
      </div>

      {!isLoading && (
        <p className="mt-4 font-mono text-xs text-blueprint-500">
          {total} {total === 1 ? "technician" : "technicians"} found
        </p>
      )}

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-36 w-full" />)}

        {!isLoading && technicians.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-3">
            <EmptyState icon={Users} title="No technicians found" description="Try a different search or clear the filters." />
          </div>
        )}

        {!isLoading && technicians.map((t) => <TechnicianCard key={t.id} technician={t} />)}
      </div>

      {!isLoading && <Pagination page={page} limit={LIMIT} total={total} onPageChange={setPage} />}
    </div>
  );
}