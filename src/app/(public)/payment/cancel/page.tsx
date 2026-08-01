import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <XCircle className="h-14 w-14 text-amber-600" />
      <h1 className="mt-4 font-display text-2xl font-bold text-blueprint-900">Payment cancelled</h1>
      <p className="mt-2 text-sm text-blueprint-500">
        No charge was made. You can try paying again anytime from your bookings dashboard.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/dashboard/customer">
          <Button variant="outline">Back to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
