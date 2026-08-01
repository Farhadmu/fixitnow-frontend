"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Booking } from "@/types";
import { toast } from "sonner";
import { ApiError } from "@/lib/apiError";

export function useMyBookings(status?: string) {
  return useQuery({
    queryKey: ["my-bookings", status],
    queryFn: () => api.get<Booking[]>(`/bookings${status ? `?status=${status}` : ""}`),
  });
}

export function useBooking(id: string | undefined) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => api.get<Booking>(`/bookings/${id}`),
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { serviceId: string; scheduledAt: string; address: string }) =>
      api.post<Booking>("/bookings", payload),
    onSuccess: () => {
      toast.success("Booking request sent to the technician");
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<Booking>(`/bookings/${id}/cancel`),
    onSuccess: () => {
      toast.success("Booking cancelled");
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });
}

// Technician-side booking management
export function useTechnicianBookings(status?: string) {
  return useQuery({
    queryKey: ["technician-bookings", status],
    queryFn: () => api.get<Booking[]>(`/technician/bookings/me${status ? `?status=${status}` : ""}`),
  });
}

export function useUpdateBookingStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch<Booking>(`/technician/bookings/${id}`, { status }),
    onSuccess: (_data, variables) => {
      toast.success(`Booking marked as ${variables.status.replace("_", " ").toLowerCase()}`);
      qc.invalidateQueries({ queryKey: ["technician-bookings"] });
      qc.invalidateQueries({ queryKey: ["booking"] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });
}
