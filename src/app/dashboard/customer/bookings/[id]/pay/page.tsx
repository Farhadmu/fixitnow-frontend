"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { RequireRole } from "@/components/RequireRole";
import { useBooking } from "@/hooks/useBookings";
import { useCreatePayment } from "@/hooks/usePayments";
import { Button } from "@/components/ui/Button";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { formatCurrency } from "@/lib/utils";

function PayPageContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading } = useBooking(params.id);
  const createPayment = useCreatePayment();
  const [redirecting, setRedirecting] = useState(false);

  const booking = data?.data;

  useEffect(() => {
    if (booking && booking.status !== "ACCEPTED") {
      router.replace("/dashboard/customer");
    }
  }, [booking, router]);

  const handlePay = async () => {
    setRedirecting(true);
    try {
      const res = await createPayment.mutateAsync(params.id);
      window.location.href = res.data.checkoutUrl;
    } catch {
      setRedirecting(false);
    }
  };

  if (isLoading || !booking) return <FullPageSpinner />;

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-ticket border border-blueprint-800/10 bg-paper-50 p-6">
        <div className="flex items-center gap-2 border-b border-dashed border-blueprint-800/15 pb-3 font-mono text-xs uppercase tracking-wide text-blueprint-500">
          <CreditCard className="h-3.5 w-3.5" />
          Checkout
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blueprint-500">Service</span>
            <span className="font-medium text-blueprint-900">{booking.service?.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blueprint-500">Technician</span>
            <span className="font-medium text-blueprint-900">{booking.technician?.user?.name}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-ticket bg-blueprint-900 px-4 py-3">
          <span className="font-mono text-xs text-paper-200">TOTAL</span>
          <span className="font-display text-lg font-bold text-amber-500">{formatCurrency(booking.totalAmount)}</span>
        </div>

        <Button className="mt-5 w-full" onClick={handlePay} isLoading={redirecting || createPayment.isPending}>
          Continue to Stripe checkout
        </Button>
        <p className="mt-2 text-center text-xs text-blueprint-400">
          You&apos;ll be redirected to Stripe&apos;s secure checkout page.
        </p>
      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <RequireRole role="CUSTOMER">
      <PayPageContent />
    </RequireRole>
  );
}
