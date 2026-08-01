"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, dashboardHomeFor } from "@/hooks/useAuth";
import { FullPageSpinner } from "@/components/ui/Spinner";
import type { Role } from "@/types";

export function RequireRole({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== role) {
      router.replace(dashboardHomeFor(user));
    }
  }, [user, isLoading, role, router]);

  if (isLoading || !user || user.role !== role) return <FullPageSpinner />;

  return <>{children}</>;
}
