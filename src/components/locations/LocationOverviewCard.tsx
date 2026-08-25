import Link from "next/link";
import {
  Archive,
  Refrigerator,
  Warehouse,
} from "lucide-react";

import { OccupancyBadge } from "./OccupancyBadge";
import { ProgressBar } from "./ProgressBar";

export type LocationOverview = {
  id: string;
  code: string;
  name: string;
  type: string;
  description: string;
  allowedTypes: string[];
  sampleCount: number;
  capacity: number;
  occupancy: number;
};

type LocationOverviewCardProps = {
  location: LocationOverview;
};

export function LocationOverviewCard({
  location,
}: LocationOverviewCardProps) {
  const availableSpaces = Math.max(
    location.capacity - location.sampleCount,
    0
  );

  return (
    <Link
      href={`/locations/${location.id}`}
      className="group block rounded-3xl border border-border bg-surface p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <LocationTypeIcon type={location.type} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent">
              {location.code}
            </p>

            <h3 className="mt-1 text-lg font-black leading-snug text-primary transition group-hover:text-accent">
              {location.name}
            </h3>

            <p className="mt-1 text-xs font-bold text-secondary">
              {location.type}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <OccupancyBadge occupancy={location.occupancy} />
        </div>
      </div>

      {/* Description */}
      <p className="mt-5 text-sm leading-6 text-secondary">
        {location.description}
      </p>

      {/* Occupancy */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-bold text-secondary">
            Ocupación
          </p>

          <p className="text-xs font-black text-primary">
            {location.occupancy}%
          </p>
        </div>

        <ProgressBar occupancy={location.occupancy} />
      </div>

      {/* Metrics */}
      <div className="mt-5 grid grid-cols-3 gap-4 border-t border-border pt-5">
        <CardMetric
          value={location.sampleCount}
          label="Muestras"
        />

        <CardMetric
          value={availableSpaces}
          label="Espacios libres"
        />

        <CardMetric
          value={location.capacity}
          label="Capacidad"
        />
      </div>

      {/* Allowed sample types */}
      <div className="mt-5">
        <p className="text-xs font-bold text-secondary">
          Tipos permitidos
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {location.allowedTypes.map((type) => (
            <span
              key={type}
              className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent"
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function CardMetric({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div>
      <p className="text-lg font-black text-primary">
        {value}
      </p>

      <p className="mt-1 text-xs text-secondary">
        {label}
      </p>
    </div>
  );
}

function LocationTypeIcon({
  type,
}: {
  type: string;
}) {
  switch (type) {
    case "Refrigerado":
    case "Refrigerador":
      return <Refrigerator size={22} />;

    case "Gabinete":
      return <Archive size={22} />;

    default:
      return <Warehouse size={22} />;
  }
}