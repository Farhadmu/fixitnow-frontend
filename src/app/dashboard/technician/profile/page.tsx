"use client";

import { RequireRole } from "@/components/RequireRole";
import { useAuth } from "@/hooks/useAuth";
import { useTechnician } from "@/hooks/usePublicData";
import { ProfileForm } from "@/components/ProfileForm";
import { AvailabilityScheduler } from "@/components/AvailabilityScheduler";
import { ServiceManager } from "@/components/ServiceManager";
import { FullPageSpinner } from "@/components/ui/Spinner";

function TechnicianProfileContent() {
  const { user } = useAuth();
  const technicianId = user?.technicianProfile?.id;
  const { data, isLoading } = useTechnician(technicianId);

  if (isLoading || !data) return <FullPageSpinner />;

  const profile = data.data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-blueprint-900">Profile &amp; services</h1>
        <p className="mt-1 text-sm text-blueprint-500">Keep your details current so customers can find and book you.</p>
      </div>

      <ProfileForm profile={profile} />
      <AvailabilityScheduler slots={profile.availability || []} />
      <ServiceManager services={profile.services || []} />
    </div>
  );
}

export default function TechnicianProfilePage() {
  return (
    <RequireRole role="TECHNICIAN">
      <TechnicianProfileContent />
    </RequireRole>
  );
}
