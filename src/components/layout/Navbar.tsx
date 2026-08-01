"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Wrench, Menu, X, LogOut, LayoutDashboard, Search } from "lucide-react";
import { useAuth, dashboardHomeFor } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/technicians", label: "Technicians" },
];

export function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/services${query ? `?search=${encodeURIComponent(query)}` : ""}`);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-blueprint-800/10 bg-paper-100/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-display text-lg font-bold text-blueprint-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-ticket bg-blueprint-900 text-amber-500">
            <Wrench className="h-4 w-4" />
          </span>
          FixItNow
        </Link>

        <form onSubmit={handleSearch} className="relative hidden max-w-xs flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blueprint-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services..."
            aria-label="Search services"
            className="h-9 w-full rounded-full border border-blueprint-800/15 bg-paper-50 pl-9 pr-3 text-sm text-blueprint-900 placeholder:text-blueprint-400 focus:outline-none focus:ring-2 focus:ring-amber-500/60"
          />
        </form>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-blueprint-600 hover:text-blueprint-900",
                pathname.startsWith(link.href) && "text-blueprint-900"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!isLoading && !user && (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Get started
                </Button>
              </Link>
            </>
          )}
          {!isLoading && user && (
            <>
              <Link href={dashboardHomeFor(user)}>
                <Button variant="secondary" size="sm">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-blueprint-800/10 bg-paper-100 px-4 py-4 md:hidden">
          <form onSubmit={handleSearch} className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blueprint-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services..."
              aria-label="Search services"
              className="h-9 w-full rounded-full border border-blueprint-800/15 bg-paper-50 pl-9 pr-3 text-sm text-blueprint-900 placeholder:text-blueprint-400 focus:outline-none focus:ring-2 focus:ring-amber-500/60"
            />
          </form>
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-sm font-medium text-blueprint-700">
                {link.label}
              </Link>
            ))}
            {!user ? (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-blueprint-700">
                  Log in
                </Link>
                <Link href="/register" onClick={() => setOpen(false)} className="text-sm font-medium text-blueprint-700">
                  Get started
                </Link>
              </>
            ) : (
              <>
                <Link href={dashboardHomeFor(user)} onClick={() => setOpen(false)} className="text-sm font-medium text-blueprint-700">
                  Dashboard
                </Link>
                <button onClick={logout} className="text-left text-sm font-medium text-rust-500">
                  Sign out
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}