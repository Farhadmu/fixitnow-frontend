"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileInput } from "@/lib/validations";
import { useUpdateProfile } from "@/hooks/useTechnicianActions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { FieldError } from "@/components/ui/FieldError";
import type { TechnicianProfile } from "@/types";

export function ProfileForm({ profile }: { profile: TechnicianProfile }) {
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: profile.bio || "",
      experience: profile.experience || 0,
      location: profile.location || "",
    },
  });

  return (
    <form onSubmit={handleSubmit((v) => updateProfile.mutate(v))} className="space-y-4 rounded-ticket border border-blueprint-800/10 bg-paper-50 p-5">
      <h2 className="font-display text-lg font-semibold text-blueprint-900">Profile</h2>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" rows={3} placeholder="Tell customers about your experience..." error={errors.bio?.message} {...register("bio")} />
        <FieldError message={errors.bio?.message} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="experience">Years of experience</Label>
          <Input id="experience" type="number" min={0} error={errors.experience?.message} {...register("experience")} />
          <FieldError message={errors.experience?.message} />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="e.g. Dhaka" {...register("location")} />
        </div>
      </div>

      <Button type="submit" isLoading={updateProfile.isPending}>
        Save profile
      </Button>
    </form>
  );
}
