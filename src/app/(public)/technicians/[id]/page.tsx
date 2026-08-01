"use client";

import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { MapPin, Star, Wrench, MessageSquare } from "lucide-react";
import { useTechnician } from "@/hooks/usePublicData";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { BookingForm } from "@/components/BookingForm";
import { formatCurrency, formatDate, DAY_NAMES } from "@/lib/utils";

export default function TechnicianProfilePage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const defaultServiceId = searchParams.get("service") || undefined;

  const { data, isLoading, error } = useTechnician(params.id);
  const technician = data?.data;

  if (isLoading) return <FullPageSpinner />;

  if (error || !technician) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState icon={Wrench} title="Technician not found" description="This profile may have been removed." />
      </div>
    );
  }

  const activeServices = (technician.services || []).filter((s) => s.isActive);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-start gap-4">
            <Image
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${technician.id}`}
              alt={technician.user?.name || "Technician avatar"}
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 rounded-full bg-blueprint-900"
              unoptimized
            />
            <div>
              <h1 className="font-display text-2xl font-bold text-blueprint-900">{technician.user?.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-blueprint-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {technician.location || "Location not set"}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  {technician.avgRating?.toFixed(1) || "New"} ({technician.totalReviews || 0} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Wrench className="h-3.5 w-3.5" />
                  {technician.experience || 0} yrs experience
                </span>
              </div>
            </div>
          </div>

          {technician.bio && <p className="mt-5 text-sm leading-relaxed text-blueprint-600">{technician.bio}</p>}

          {/* Services */}
          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-blueprint-900">Services</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {activeServices.length === 0 && <p className="text-sm text-blueprint-500">No active services listed.</p>}
              {activeServices.map((s) => (
                <div key={s.id} className="rounded-ticket border border-blueprint-800/10 bg-paper-50 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-blueprint-900">{s.title}</h3>
                    <span className="font-display font-bold text-blueprint-900">{formatCurrency(s.price)}</span>
                  </div>
                  {s.description && <p className="mt-1 text-xs text-blueprint-500">{s.description}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          {technician.availability && technician.availability.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-lg font-semibold text-blueprint-900">Weekly availability</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {technician.availability.map((slot) => (
                  <span
                    key={slot.id}
                    className="rounded-full border border-blueprint-800/15 px-3 py-1 font-mono text-xs text-blueprint-600"
                  >
                    {DAY_NAMES[slot.dayOfWeek]?.slice(0, 3)} {slot.startTime}–{slot.endTime}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="mt-8">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-blueprint-900">
              <MessageSquare className="h-4 w-4" />
              Reviews
            </h2>
            <div className="mt-3 space-y-3">
              {(!technician.reviews || technician.reviews.length === 0) && (
                <p className="text-sm text-blueprint-500">No reviews yet.</p>
              )}
              {technician.reviews?.map((r) => (
                <div key={r.id} className="rounded-ticket border border-blueprint-800/10 bg-paper-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blueprint-900">{r.customer?.name || "Customer"}</span>
                    <div className="flex items-center gap-1 text-xs text-amber-600">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="mt-1.5 text-sm text-blueprint-600">{r.comment}</p>}
                  <p className="mt-1.5 text-xs text-blueprint-400">{formatDate(r.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking form */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <BookingForm services={activeServices} defaultServiceId={defaultServiceId} />
        </div>
      </div>
    </div>
  );
}
