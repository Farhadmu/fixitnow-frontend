"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Availability, Service, TechnicianProfile } from "@/types";
import { toast } from "sonner";
import { ApiError } from "@/lib/apiError";
import type { ProfileInput, ServiceInput, AvailabilityInput, ReviewInput } from "@/lib/validations";

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProfileInput) => api.put<TechnicianProfile>("/technician/profile/me", payload),
    onSuccess: () => {
      toast.success("Profile updated");
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });
}

export function useUpdateAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AvailabilityInput) => api.put<Availability[]>("/technician/availability/me", payload),
    onSuccess: () => {
      toast.success("Availability updated");
      qc.invalidateQueries({ queryKey: ["technician-availability"] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ServiceInput) => api.post<Service>("/services", payload),
    onSuccess: () => {
      toast.success("Service created");
      qc.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ServiceInput> & { isActive?: boolean } }) =>
      api.patch<Service>(`/services/${id}`, payload),
    onSuccess: () => {
      toast.success("Service updated");
      qc.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/services/${id}`),
    onSuccess: () => {
      toast.success("Service deleted");
      qc.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReviewInput & { bookingId: string }) => api.post("/reviews", payload),
    onSuccess: () => {
      toast.success("Thanks for the review!");
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });
}
