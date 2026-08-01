"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PublicError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-ticket bg-rust-500/10 text-rust-500">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <h1 className="mt-5 font-display text-xl font-bold text-blueprint-900">Couldn&apos;t load this page</h1>
      <p className="mt-2 text-sm text-blueprint-500">
        Something went wrong fetching this data. It might be a temporary network issue.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Link href="/">
          <Button variant="outline">Go home</Button>
        </Link>
      </div>
    </div>
  );
}
