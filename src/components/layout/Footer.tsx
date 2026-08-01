import Link from "next/link";
import { Wrench } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-blueprint-800/10 bg-paper-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-2 font-display text-sm font-semibold text-blueprint-900">
          <Wrench className="h-4 w-4" />
          FixItNow
        </div>
        <p className="text-xs text-blueprint-500">
          Assignment 5 — Frontend for the FixItNow home service marketplace API.
        </p>
        <div className="flex gap-4 text-xs text-blueprint-500">
          <Link href="/services" className="hover:text-blueprint-800">
            Services
          </Link>
          <Link href="/technicians" className="hover:text-blueprint-800">
            Technicians
          </Link>
        </div>
      </div>
    </footer>
  );
}
