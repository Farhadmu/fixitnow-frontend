import Link from "next/link";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper-100 px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-ticket bg-blueprint-900 text-amber-500">
        <Wrench className="h-7 w-7" />
      </span>
      <h1 className="mt-5 font-display text-3xl font-bold text-blueprint-900">404 — Job not found</h1>
      <p className="mt-2 max-w-sm text-sm text-blueprint-500">
        This page doesn&apos;t exist, or the ticket was closed out. Let&apos;s get you back on track.
      </p>
      <Link href="/" className="mt-6">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
