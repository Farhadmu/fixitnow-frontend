"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Payment } from "@/types";
import { toast } from "sonner";
import { ApiError } from "@/lib/apiError";

export function useMyPayments() {
  return useQuery({
    queryKey: ["my-payments"],
    queryFn: () => api.get<Payment[]>("/payments"),
  });
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: (bookingId: string) =>
      api.post<{ payment: Payment; checkoutUrl: string; sessionId: string }>("/payments/create", { bookingId }),
    onError: (err: ApiError) => toast.error(err.message),
  });
}

export function useConfirmPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => api.post<Payment>("/payments/confirm", { sessionId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
      qc.invalidateQueries({ queryKey: ["my-payments"] });
    },
  });
}
