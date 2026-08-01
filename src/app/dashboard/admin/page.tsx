"use client";

import { useState } from "react";
import { Users, ShieldBan, ShieldCheck, Search, BarChart3 } from "lucide-react";
import { RequireRole } from "@/components/RequireRole";
import { useAdminUsers, useUpdateUserStatus, useAdminBookings } from "@/hooks/useAdmin";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/Pagination";
import { BookingsByStatusChart } from "@/components/BookingsByStatusChart";
import { formatCurrency, formatDate, initials } from "@/lib/utils";

const LIMIT = 8;

function AdminUsersContent() {
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: usersRes, isLoading } = useAdminUsers({
    role: role || undefined,
    status: status || undefined,
    page: search ? 1 : page,
    limit: search ? 100 : LIMIT,
  });
  const { data: bookingsRes } = useAdminBookings();
  const updateStatus = useUpdateUserStatus();

  const allUsers = usersRes?.data || [];
  const users = search ? allUsers.filter((u) => u.name.toLowerCase().includes(search.toLowerCase())) : allUsers;
  const total = search ? users.length : usersRes?.meta?.total ?? users.length;

  const bookings = bookingsRes?.data || [];
  const activeBookings = bookings.filter((b) => ["ACCEPTED", "PAID", "IN_PROGRESS"].includes(b.status));
  const revenue = bookings
    .filter((b) => b.payment?.status === "COMPLETED")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-blueprint-900">Platform overview</h1>
        <p className="mt-1 text-sm text-blueprint-500">Manage users and monitor platform activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-ticket border border-blueprint-800/10 bg-paper-50 p-4">
          <p className="font-mono text-xs uppercase tracking-wide text-blueprint-500">Total users</p>
          <p className="font-display text-2xl font-bold text-blueprint-900">{usersRes?.meta?.total ?? "—"}</p>
        </div>
        <div className="rounded-ticket border border-blueprint-800/10 bg-paper-50 p-4">
          <p className="font-mono text-xs uppercase tracking-wide text-blueprint-500">Active bookings</p>
          <p className="font-display text-2xl font-bold text-blueprint-900">{activeBookings.length}</p>
        </div>
        <div className="rounded-ticket border border-blueprint-800/10 bg-paper-50 p-4">
          <p className="font-mono text-xs uppercase tracking-wide text-blueprint-500">Revenue collected</p>
          <p className="font-display text-2xl font-bold text-blueprint-900">{formatCurrency(revenue)}</p>
        </div>
      </div>

      <div>
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-blueprint-900">
          <BarChart3 className="h-4 w-4" />
          Bookings by status
        </h2>
        <div className="mt-4 rounded-ticket border border-blueprint-800/10 bg-paper-50 p-4">
          <BookingsByStatusChart bookings={bookings} />
        </div>
      </div>

      <div>
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-blueprint-900">
          <Users className="h-4 w-4" />
          Users
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blueprint-400" />
            <Input
              placeholder="Search by name"
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="TECHNICIAN">Technician</option>
            <option value="ADMIN">Admin</option>
          </Select>
          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="BANNED">Banned</option>
          </Select>
        </div>

        <div className="mt-4 overflow-x-auto rounded-ticket border border-blueprint-800/10 bg-paper-50">
          {isLoading && <Skeleton className="h-40 w-full" />}

          {!isLoading && users.length === 0 && (
            <div className="p-8">
              <EmptyState icon={Users} title="No users found" description="Try a different search or filter." />
            </div>
          )}

          {!isLoading && users.length > 0 && (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-blueprint-800/10 bg-blueprint-800/5 font-mono text-xs uppercase tracking-wide text-blueprint-500">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-blueprint-800/5 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blueprint-900 font-mono text-[10px] font-bold text-amber-500">
                          {initials(u.name)}
                        </div>
                        <div>
                          <p className="font-medium text-blueprint-900">{u.name}</p>
                          <p className="text-xs text-blueprint-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{u.role}</td>
                    <td className="px-4 py-3">
                      <span className={u.status === "BANNED" ? "text-rust-500" : "text-moss-600"}>{u.status}</span>
                    </td>
                    <td className="px-4 py-3 text-blueprint-500">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      {u.role !== "ADMIN" && (
                        <Button
                          size="sm"
                          variant={u.status === "BANNED" ? "secondary" : "danger"}
                          isLoading={updateStatus.isPending && updateStatus.variables?.id === u.id}
                          onClick={() =>
                            updateStatus.mutate({ id: u.id, status: u.status === "BANNED" ? "ACTIVE" : "BANNED" })
                          }
                        >
                          {u.status === "BANNED" ? (
                            <>
                              <ShieldCheck className="h-3.5 w-3.5" /> Unban
                            </>
                          ) : (
                            <>
                              <ShieldBan className="h-3.5 w-3.5" /> Ban
                            </>
                          )}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!isLoading && !search && <Pagination page={page} limit={LIMIT} total={total} onPageChange={setPage} />}
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <RequireRole role="ADMIN">
      <AdminUsersContent />
    </RequireRole>
  );
}