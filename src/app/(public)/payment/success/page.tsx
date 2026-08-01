"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { useConfirmPayment } from "@/hooks/usePayments";
import { Button } from "@/components/ui/Button";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { formatCurrency } from "@/lib/utils";
import type { Payment } from "@/types";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const confirmPayment = useConfirmPayment();
  const [result, setResult] = useState<Payment | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setErrorMsg("No payment session found in the URL.");
      setChecked(true);
      return;
    }
    confirmPayment.mutate(sessionId, {
      onSuccess: (res) => {
        setResult(res.data);
        setChecked(true);
      },
      onError: (err: any) => {
        setErrorMsg(err.message || "We couldn't confirm this payment.");
        setChecked(true);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (!checked) return <FullPageSpinner />;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      {result ? (
        <>
          <CheckCircle2 className="h-14 w-14 text-moss-500" />
          <h1 className="mt-4 font-display text-2xl font-bold text-blueprint-900">Payment successful</h1>
          <p className="mt-2 text-sm text-blueprint-500">
            Your payment of {formatCurrency(result.amount)} has been confirmed. The technician can now start the
            job.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/dashboard/customer">
              <Button>Go to dashboard</Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <XCircle className="h-14 w-14 text-rust-500" />
          <h1 className="mt-4 font-display text-2xl font-bold text-blueprint-900">Couldn&apos;t confirm payment</h1>
          <p className="mt-2 text-sm text-blueprint-500">{errorMsg}</p>
          <div className="mt-6 flex gap-3">
            <Link href="/dashboard/customer">
              <Button variant="outline">Back to dashboard</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
