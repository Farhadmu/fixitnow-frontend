import Link from "next/link";

import Image from "next/image";
import { MapPin, Star, Wrench } from "lucide-react";
import type { TechnicianProfile } from "@/types";

export function TechnicianCard({ technician }: { technician: TechnicianProfile }) {
  return (
    <Link
      href={`/technicians/${technician.id}`}
      className="group flex flex-col gap-3 rounded-ticket border border-blueprint-800/10 bg-paper-50 p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <Image
          src={`https://api.dicebear.com/7.x/notionists/svg?seed=${technician.id}`}
          alt={technician.user?.name || "Technician avatar"}
          width={48}
          height={48}
          className="h-12 w-12 shrink-0 rounded-full bg-blueprint-900"
          unoptimized
        />
        <div>
          <h3 className="font-display text-sm font-semibold text-blueprint-900 group-hover:text-amber-700">
            {technician.user?.name || "Technician"}
          </h3>
          <div className="flex items-center gap-1 text-xs text-blueprint-500">
            <MapPin className="h-3 w-3" />
            {technician.location || "Location not set"}
          </div>
        </div>
      </div>

      {technician.bio && <p className="line-clamp-2 text-xs text-blueprint-500">{technician.bio}</p>}

      <div className="flex items-center justify-between border-t border-dashed border-blueprint-800/15 pt-3 text-xs">
        <div className="flex items-center gap-1 font-medium text-blueprint-700">
          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          {technician.avgRating?.toFixed(1) || "New"}
          <span className="text-blueprint-400">({technician.totalReviews || 0})</span>
        </div>
        <div className="flex items-center gap-1 text-blueprint-500">
          <Wrench className="h-3.5 w-3.5" />
          {technician.experience || 0} yrs exp.
        </div>
      </div>
    </Link>
  );
}
