"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Wrench, User as UserIcon, HardHat } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/apiError";
import { useAuth, dashboardHomeFor } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FieldError } from "@/components/ui/FieldError";
import { cn } from "@/lib/utils";
import type { User as UserType } from "@/types";

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema), defaultValues: { role: "CUSTOMER" } });

  const role = watch("role");

  const onSubmit = async (values: RegisterInput) => {
    try {
      const res = await api.post<{ user: UserType; accessToken: string }>("/auth/register", values, { auth: false });
      login(res.data.accessToken, res.data.user);
      toast.success("Account created! Welcome to FixItNow.");
      router.push(dashboardHomeFor(res.data.user));
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldErrors = err.fieldErrors();
        Object.entries(fieldErrors).forEach(([field, message]) =>
          setError(field as keyof RegisterInput, { message })
        );
        if (Object.keys(fieldErrors).length === 0) toast.error(err.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-6 flex items-center gap-2 font-display text-lg font-bold text-blueprint-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-ticket bg-blueprint-900 text-amber-500">
          <Wrench className="h-4 w-4" />
        </span>
        FixItNow
      </div>

      <h1 className="font-display text-2xl font-bold text-blueprint-900">Create your account</h1>
      <p className="mt-1 text-sm text-blueprint-500">Book services or offer your skills as a technician.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <Label>I am a...</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue("role", "CUSTOMER")}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-ticket border p-3 text-sm font-medium transition-colors",
                role === "CUSTOMER"
                  ? "border-amber-500 bg-amber-500/10 text-blueprint-900"
                  : "border-blueprint-800/15 text-blueprint-500 hover:border-blueprint-800/30"
              )}
            >
              <UserIcon className="h-5 w-5" />
              Customer
            </button>
            <button
              type="button"
              onClick={() => setValue("role", "TECHNICIAN")}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-ticket border p-3 text-sm font-medium transition-colors",
                role === "TECHNICIAN"
                  ? "border-amber-500 bg-amber-500/10 text-blueprint-900"
                  : "border-blueprint-800/15 text-blueprint-500 hover:border-blueprint-800/30"
              )}
            >
              <HardHat className="h-5 w-5" />
              Technician
            </button>
          </div>
          <FieldError message={errors.role?.message} />
        </div>

        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Jane Doe" error={errors.name?.message} {...register("name")} />
          <FieldError message={errors.name?.message} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" placeholder="01700000000" {...register("phone")} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="At least 6 characters" error={errors.password?.message} {...register("password")} />
          <FieldError message={errors.password?.message} />
        </div>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-blueprint-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-amber-700 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
