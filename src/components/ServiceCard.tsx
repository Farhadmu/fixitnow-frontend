import Link from "next/link";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import type { Service } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function ServiceCard({ service }: { service: Service }) {
  const tech = service.technician;
  return (
    <Link
      href={tech ? `/technicians/${tech.id}?service=${service.id}` : "#"}
      className="group flex flex-col overflow-hidden rounded-ticket border border-blueprint-800/10 bg-paper-50 transition-shadow hover:shadow-md"
    >
      <div className="relative h-28 w-full overflow-hidden bg-blueprint-900">
        <Image
          src={`https://picsum.photos/seed/${service.id}/400/240`}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover opacity-70 transition-opacity group-hover:opacity-90"
          unoptimized
        />
        <div className="absolute inset-0 flex items-center justify-between bg-blueprint-900/40 px-4">
          <span className="rounded-full bg-paper-100/90 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-blueprint-800">
            {service.category?.name || "Service"}
          </span>
          <span className="font-mono text-[11px] text-paper-200">#{service.id.slice(0, 6)}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-base font-semibold text-blueprint-900 group-hover:text-amber-700">
          {service.title}
        </h3>
        {service.description && <p className="line-clamp-2 text-sm text-blueprint-500">{service.description}</p>}

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-1 text-xs text-blueprint-500">
            <MapPin className="h-3.5 w-3.5" />
            {service.location || "Multiple areas"}
          </div>
          {tech && (
            <div className="flex items-center gap-1 text-xs font-medium text-blueprint-700">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              {tech.avgRating?.toFixed(1) || "New"}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-dashed border-blueprint-800/15 pt-3">
          <span className="text-xs text-blueprint-500">{tech?.user?.name || "Technician"}</span>
          <span className="font-display text-lg font-bold text-blueprint-900">{formatCurrency(service.price)}</span>
        </div>
      </div>
    </Link>
  );
}
