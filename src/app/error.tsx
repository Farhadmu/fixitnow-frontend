"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper-100 px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-ticket bg-rust-500/10 text-rust-500">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <h1 className="mt-5 font-display text-2xl font-bold text-blueprint-900">Something broke on our end</h1>
      <p className="mt-2 max-w-sm text-sm text-blueprint-500">
        The page hit an unexpected error. You can try again, or head back to the homepage.
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
