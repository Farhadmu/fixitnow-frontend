"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Star, Wrench, Zap } from "lucide-react";
import { useServices, useCategories } from "@/hooks/usePublicData";
import { ServiceCard } from "@/components/ServiceCard";
import { ServiceCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

const HOW_IT_WORKS = [
  { title: "Describe the job", desc: "Browse by category or search for the exact fix you need.", icon: Wrench },
  { title: "Pick a slot", desc: "Choose a vetted technician and an available time that works.", icon: Zap },
  { title: "Pay when accepted", desc: "Secure Stripe checkout only after the technician confirms.", icon: ShieldCheck },
];

export default function HomePage() {
  const { data: servicesRes, isLoading: servicesLoading } = useServices({ limit: 6 });
  const { data: categoriesRes } = useCategories();

  const services = servicesRes?.data || [];
  const categories = categoriesRes?.data || [];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-blueprint-grid bg-grid">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center md:py-28 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-xs uppercase tracking-wide text-amber-500">
              Work Order #0001 · Open
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-paper-100 sm:text-5xl">
              Book a technician,
              <br />
              not a gamble.
            </h1>
            <p className="mt-4 max-w-md text-blueprint-300">
              Plumbing, wiring, cleaning, painting — find a vetted pro, lock a time slot, and pay only once the job
              is accepted. Every booking tracked start to finish.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/services">
                <Button size="lg">
                  Browse services
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="border-paper-100/30 text-paper-100 hover:bg-paper-100/10">
                  Join as a technician
                </Button>
              </Link>
            </div>
          </div>

          {/* Signature ticket element */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="ticket-notch ticket-perforation rounded-ticket border border-paper-100/10 bg-paper-100 p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-dashed border-blueprint-800/20 pb-3">
                <span className="font-mono text-[11px] uppercase tracking-widest text-blueprint-500">Job Ticket</span>
                <span className="font-mono text-[11px] text-blueprint-400">STATUS: PAID</span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-blueprint-500">Service</span>
                  <span className="font-medium text-blueprint-900">Pipe Leak Repair</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blueprint-500">Technician</span>
                  <span className="font-medium text-blueprint-900">J. Rahman</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blueprint-500">Slot</span>
                  <span className="font-medium text-blueprint-900">Tomorrow, 10:00 AM</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blueprint-500">Rating</span>
                  <span className="flex items-center gap-1 font-medium text-blueprint-900">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> 4.9
                  </span>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between rounded-ticket bg-blueprint-900 px-4 py-3">
                <span className="font-mono text-xs text-paper-200">TOTAL</span>
                <span className="font-display text-lg font-bold text-amber-500">$45.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories strip */}
      {categories.length > 0 && (
        <section className="border-b border-blueprint-800/10 bg-paper-50">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-5 sm:px-6 lg:px-8">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/services?categoryId=${c.id}`}
                className="rounded-full border border-blueprint-800/15 px-3 py-1.5 text-xs font-medium text-blueprint-600 hover:border-amber-500 hover:text-blueprint-900"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold text-blueprint-900">How it works</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.title} className="rounded-ticket border border-blueprint-800/10 bg-paper-50 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-ticket bg-blueprint-900 text-amber-500">
                <step.icon className="h-4 w-4" />
              </div>
              <h3 className="mt-4 font-display text-sm font-semibold text-blueprint-900">
                {i + 1}. {step.title}
              </h3>
              <p className="mt-1.5 text-sm text-blueprint-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured services */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-blueprint-900">Featured services</h2>
          <Link href="/services" className="text-sm font-medium text-amber-700 hover:underline">
            View all
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {servicesLoading &&
            Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}

          {!servicesLoading && services.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState
                icon={Wrench}
                title="No services yet"
                description="Once technicians publish services, they'll show up here."
              />
            </div>
          )}

          {!servicesLoading && services.map((s) => <ServiceCard key={s.id} service={s} />)}
        </div>
      </section>
    </>
  );
}
