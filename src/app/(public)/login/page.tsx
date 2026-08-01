"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Wrench } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/apiError";
import { useAuth, dashboardHomeFor } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FieldError } from "@/components/ui/FieldError";
import type { User } from "@/types";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginInput) => {
    try {
      const res = await api.post<{ user: User; accessToken: string }>("/auth/login", values, { auth: false });
      login(res.data.accessToken, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name.split(" ")[0]}!`);
      const redirect = searchParams.get("redirect");
      router.push(redirect || dashboardHomeFor(res.data.user));
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldErrors = err.fieldErrors();
        Object.entries(fieldErrors).forEach(([field, message]) =>
          setError(field as keyof LoginInput, { message })
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

      <h1 className="font-display text-2xl font-bold text-blueprint-900">Welcome back</h1>
      <p className="mt-1 text-sm text-blueprint-500">Log in to manage your bookings and jobs.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
          <FieldError message={errors.password?.message} />
        </div>
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-blueprint-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-amber-700 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
