"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Booking, Category, User } from "@/types";
import { toast } from "sonner";
import { ApiError } from "@/lib/apiError";
import type { CategoryInput } from "@/lib/validations";

export function useAdminUsers(filters: { role?: string; status?: string; page?: number; limit?: number } = {}) {
  const qs = new URLSearchParams();
  if (filters.role) qs.set("role", filters.role);
  if (filters.status) qs.set("status", filters.status);
  if (filters.page) qs.set("page", String(filters.page));
  if (filters.limit) qs.set("limit", String(filters.limit));
  const query = qs.toString() ? `?${qs.toString()}` : "";

  return useQuery({
    queryKey: ["admin-users", filters],
    queryFn: () => api.get<User[]>(`/admin/users${query}`),
  });
}

export function useUpdateUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "BANNED" }) =>
      api.patch<User>(`/admin/users/${id}`, { status }),
    onSuccess: (_data, variables) => {
      toast.success(variables.status === "BANNED" ? "User banned" : "User unbanned");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });
}

export function useAdminBookings(status?: string) {
  return useQuery({
    queryKey: ["admin-bookings", status],
    queryFn: () => api.get<Booking[]>(`/admin/bookings${status ? `?status=${status}` : ""}`),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryInput) => api.post<Category>("/admin/categories", payload),
    onSuccess: () => {
      toast.success("Category created");
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CategoryInput> }) =>
      api.patch<Category>(`/categories/${id}`, payload),
    onSuccess: () => {
      toast.success("Category updated");
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      toast.success("Category deleted");
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });
}