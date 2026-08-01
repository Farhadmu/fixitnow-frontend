"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Service, Category, TechnicianProfile } from "@/types";

export interface ServiceFilters {
  search?: string;
  categoryId?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

function toQueryString(filters: Record<string, unknown>) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function useServices(filters: ServiceFilters = {}) {
  return useQuery({
    queryKey: ["services", filters],
    queryFn: () => api.get<Service[]>(`/services${toQueryString(filters)}`, { auth: false }),
  });
}

export function useService(id: string | undefined) {
  return useQuery({
    queryKey: ["service", id],
    queryFn: () => api.get<Service>(`/services/${id}`, { auth: false }),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<Category[]>("/categories", { auth: false }),
  });
}

export interface TechnicianFilters {
  search?: string;
  location?: string;
  minRating?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export function useTechnicians(filters: TechnicianFilters = {}) {
  return useQuery({
    queryKey: ["technicians", filters],
    queryFn: () => api.get<TechnicianProfile[]>(`/technicians${toQueryString(filters)}`, { auth: false }),
  });
}

export function useTechnician(id: string | undefined) {
  return useQuery({
    queryKey: ["technician", id],
    queryFn: () => api.get<TechnicianProfile>(`/technicians/${id}`, { auth: false }),
    enabled: !!id,
  });
}