import Link from "next/link";

import {
  Archive,
  Biohazard,
  LightbulbOff,
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
  description: string | null;

  maxAreaCm2: number | null;
  usedAreaCm2: number;

  sampleCount: number;
  occupancy: number;

  supportsColdStorage: boolean;
  supportsLightProtection: boolean;
  supportsHazardous: boolean;

  laboratory: {
    id: string;
    name: string;
  };
};

type LocationOverviewCardProps = {
  location: LocationOverview;
};

export function LocationOverviewCard({
  location,
}: LocationOverviewCardProps) {
  const availableArea =
    location.maxAreaCm2 !== null
      ? Math.max(
          location.maxAreaCm2 -
            location.usedAreaCm2,
          0
        )
      : null;

  return (
    <Link
      href={`/locations/${location.id}`}
      className="group block rounded-3xl border border-border bg-surface p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md"
    >
      {/* Header */}

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <LocationTypeIcon
              type={location.type}
            />
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
          <OccupancyBadge
            occupancy={location.occupancy}
          />
        </div>
      </div>

      {/* Laboratory */}

      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-secondary">
        {location.laboratory.name}
      </p>

      {/* Description */}

      {location.description && (
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-secondary">
          {location.description}
        </p>
      )}

      {/* Occupancy */}

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-bold text-secondary">
            Ocupación por área
          </p>

          <p className="text-xs font-black text-primary">
            {location.occupancy.toFixed(1)}%
          </p>
        </div>

        <ProgressBar
          occupancy={location.occupancy}
        />
      </div>

      {/* Metrics */}

      <div className="mt-5 grid grid-cols-3 gap-4 border-t border-border pt-5">
        <CardMetric
          value={location.sampleCount.toString()}
          label="Muestras"
        />

        <CardMetric
          value={`${Math.round(
            location.usedAreaCm2
          ).toLocaleString()} cm²`}
          label="Área usada"
        />

        <CardMetric
          value={
            availableArea !== null
              ? `${Math.round(
                  availableArea
                ).toLocaleString()} cm²`
              : "—"
          }
          label="Área libre"
        />
      </div>

      {/* Storage capabilities */}

      <div className="mt-5 flex flex-wrap gap-2">
        {location.supportsColdStorage && (
          <CapabilityBadge
            icon={<Refrigerator size={14} />}
            label="Refrigerado"
          />
        )}

        {location.supportsLightProtection && (
          <CapabilityBadge
            icon={<LightbulbOff size={14} />}
            label="Protección de luz"
          />
        )}

        {location.supportsHazardous && (
          <CapabilityBadge
            icon={<Biohazard size={14} />}
            label="Peligrosos"
          />
        )}
      </div>
    </Link>
  );
}

function CardMetric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <p className="text-sm font-black text-primary">
        {value}
      </p>

      <p className="mt-1 text-xs text-secondary">
        {label}
      </p>
    </div>
  );
}

function CapabilityBadge({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
      {icon}
      {label}
    </span>
  );
}

function LocationTypeIcon({
  type,
}: {
  type: string;
}) {
  switch (type.toLowerCase()) {
    case "refrigerado":
    case "refrigerador":
    case "nevera":
      return <Refrigerator size={22} />;

    case "gabinete":
      return <Archive size={22} />;

    default:
      return <Warehouse size={22} />;
  }
}