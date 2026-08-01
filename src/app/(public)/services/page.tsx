"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Wrench } from "lucide-react";
import { useServices, useCategories } from "@/hooks/usePublicData";
import { ServiceCard } from "@/components/ServiceCard";
import { ServiceCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { Pagination } from "@/components/Pagination";

const LIMIT = 9;

export default function ServicesPage() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  const { data: categoriesRes } = useCategories();
  const { data: servicesRes, isLoading } = useServices({
    search: search || undefined,
    categoryId: categoryId || undefined,
    location: location || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    page,
    limit: LIMIT,
  });

  const categories = categoriesRes?.data || [];
  const services = servicesRes?.data || [];
  const total = servicesRes?.meta?.total ?? services.length;

  const updateFilter = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-blueprint-500">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Browse &amp; filter
      </div>
      <h1 className="mt-2 font-display text-3xl font-bold text-blueprint-900">Find a service</h1>

      <div className="sticky top-16 z-20 mt-6 grid gap-4 rounded-ticket border border-blueprint-800/10 bg-paper-50/95 p-4 shadow-sm backdrop-blur sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blueprint-400" />
            <Input
              id="search"
              placeholder="e.g. pipe leak, AC repair..."
              className="pl-9"
              value={search}
              onChange={(e) => updateFilter(setSearch)(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select id="category" value={categoryId} onChange={(e) => updateFilter(setCategoryId)(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
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
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="minPrice">Min price</Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => updateFilter(setMinPrice)(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="maxPrice">Max price</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="5000"
              value={maxPrice}
              onChange={(e) => updateFilter(setMaxPrice)(e.target.value)}
            />
          </div>
        </div>
      </div>

      {!isLoading && (
        <p className="mt-4 font-mono text-xs text-blueprint-500">
          {total} {total === 1 ? "service" : "services"} found
        </p>
      )}

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}

        {!isLoading && services.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-3">
            <EmptyState icon={Wrench} title="No services match your filters" description="Try widening your search or clearing a filter." />
          </div>
        )}

        {!isLoading && services.map((s) => <ServiceCard key={s.id} service={s} />)}
      </div>

      {!isLoading && <Pagination page={page} limit={LIMIT} total={total} onPageChange={setPage} />}
    </div>
  );
}