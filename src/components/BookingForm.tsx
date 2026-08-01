"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { bookingSchema, type BookingInput } from "@/lib/validations";
import { useCreateBooking } from "@/hooks/useBookings";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FieldError } from "@/components/ui/FieldError";
import { Select } from "@/components/ui/Select";
import type { Service } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { CalendarClock } from "lucide-react";

export function BookingForm({ services, defaultServiceId }: { services: Service[]; defaultServiceId?: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const createBooking = useCreateBooking();
  const [serviceId, setServiceId] = useState(defaultServiceId || services[0]?.id || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingInput>({ resolver: zodResolver(bookingSchema) });

  const selectedService = services.find((s) => s.id === serviceId);

  const onSubmit = async (values: BookingInput) => {
    if (!user) {
      toast.info("Please log in as a customer to book this technician");
      router.push("/login");
      return;
    }
    if (user.role !== "CUSTOMER") {
      toast.error("Only customer accounts can create bookings");
      return;
    }
    if (!serviceId) {
      toast.error("Choose a service first");
      return;
    }

    await createBooking.mutateAsync({
      serviceId,
      scheduledAt: new Date(values.scheduledAt).toISOString(),
      address: values.address,
    });
    router.push("/dashboard/customer");
  };

  if (services.length === 0) {
    return <p className="text-sm text-blueprint-500">This technician has no active services to book right now.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-ticket border border-blueprint-800/10 bg-paper-50 p-5">
      <div className="flex items-center gap-2 border-b border-dashed border-blueprint-800/15 pb-3 font-mono text-xs uppercase tracking-wide text-blueprint-500">
        <CalendarClock className="h-3.5 w-3.5" />
        Book this technician
      </div>

      <div>
        <Label htmlFor="serviceId">Service</Label>
        <Select id="serviceId" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title} — {formatCurrency(s.price)}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="scheduledAt">Date &amp; time</Label>
        <Input id="scheduledAt" type="datetime-local" error={errors.scheduledAt?.message} {...register("scheduledAt")} />
        <FieldError message={errors.scheduledAt?.message} />
      </div>

      <div>
        <Label htmlFor="address">Service address</Label>
        <Input id="address" placeholder="House, road, area..." error={errors.address?.message} {...register("address")} />
        <FieldError message={errors.address?.message} />
      </div>

      {selectedService && (
        <div className="flex items-center justify-between rounded-ticket bg-blueprint-900 px-4 py-3">
          <span className="font-mono text-xs text-paper-200">TOTAL</span>
          <span className="font-display text-lg font-bold text-amber-500">{formatCurrency(selectedService.price)}</span>
        </div>
      )}

      <Button type="submit" className="w-full" isLoading={createBooking.isPending}>
        Request booking
      </Button>
      <p className="text-center text-xs text-blueprint-400">
        You&apos;ll pay only after the technician accepts your request.
      </p>
    </form>
  );
}
