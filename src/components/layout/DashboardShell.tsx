"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  Wrench,
  Users,
  Layers,
  LogOut,
  UserCog,
  CalendarClock,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn, initials } from "@/lib/utils";
import type { Role } from "@/types";

const NAV_BY_ROLE: Record<Role, { href: string; label: string; icon: any }[]> = {
  CUSTOMER: [
    { href: "/dashboard/customer", label: "My bookings", icon: CalendarCheck },
    { href: "/dashboard/customer#payments", label: "Payment history", icon: CreditCard },
  ],
  TECHNICIAN: [
    { href: "/dashboard/technician", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/technician/bookings", label: "Job requests", icon: CalendarClock },
    { href: "/dashboard/technician/profile", label: "Profile & services", icon: UserCog },
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Users", icon: Users },
    { href: "/dashboard/admin/categories", label: "Categories", icon: Layers },
  ],
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const navItems = NAV_BY_ROLE[user.role];

  return (
    <div className="flex min-h-screen bg-paper-100">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-blueprint-800/10 bg-blueprint-900 md:flex md:flex-col">
        <Link href="/" className="flex items-center gap-2 px-6 py-5 font-display text-lg font-bold text-paper-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-ticket bg-amber-500 text-blueprint-950">
            <Wrench className="h-4 w-4" />
          </span>
          FixItNow
        </Link>

        <nav className="mt-4 flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-ticket px-3 py-2.5 text-sm font-medium text-blueprint-300 hover:bg-blueprint-800 hover:text-paper-100",
                pathname === item.href.split("#")[0] && "bg-blueprint-800 text-paper-100"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-blueprint-800 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 font-display text-xs font-bold text-blueprint-950">
              {initials(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-paper-100">{user.name}</p>
              <p className="truncate text-xs text-blueprint-400">{user.role}</p>
            </div>
            <button onClick={logout} aria-label="Sign out" className="text-blueprint-400 hover:text-paper-100">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-blueprint-800/10 bg-blueprint-900 px-4 py-3 md:hidden">
        <Link href="/" className="flex items-center gap-2 font-display text-sm font-bold text-paper-100">
          <Wrench className="h-4 w-4 text-amber-500" />
          FixItNow
        </Link>
        <button onClick={logout} className="text-xs font-medium text-blueprint-300">
          Sign out
        </button>
      </div>

      <main className="flex-1 overflow-x-hidden pt-14 md:pt-0">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
