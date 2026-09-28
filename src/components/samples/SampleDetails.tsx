import {
  CalendarDays,
  Edit3,
  FlaskConical,
  MapPin,
  MoveRight,
  Scale,
} from "lucide-react";
import Link from "next/link";

import { formatDate } from "@/lib/utils/date";

import type { SampleData } from "./types";

// ======================================================
// TYPES
// ======================================================

type SampleDetailsProps = {
  sample: SampleData;
  onEdit: () => void;
  onMove: () => void;
};

// ======================================================
// COMPONENT
// ======================================================

export function SampleDetails({
  sample,
  onEdit,
  onMove,
}: SampleDetailsProps) {
  const hasLocation = Boolean(
    sample.locationId
  );

  const canMove =
    sample.status === "ACTIVE" &&
    hasLocation;

  return (
    <div className="space-y-6">
      {/* Main data */}
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-accent">
                {sample.code}
              </span>

              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                {sample.type}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  sample.status === "ACTIVE"
                    ? "bg-accent/10 text-accent"
                    : "bg-secondary/10 text-secondary"
                }`}
              >
                {sample.status === "ACTIVE"
                  ? "Activa"
                  : "Archivada"}
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-black text-primary">
              {sample.name}
            </h1>

            <p className="mt-3 max-w-3xl text-secondary">
              {sample.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onEdit}
            className="flex w-fit items-center gap-2 rounded-2xl border border-border bg-white px-5 py-3 text-sm font-bold text-primary transition hover:border-accent hover:text-accent"
          >
            <Edit3 size={18} />
            Editar
          </button>
        </div>
      </section>

      {/* Physical values */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DetailCard
          label="Peso"
          value={`${sample.weight} g`}
          icon={<Scale size={19} />}
        />

        <DetailCard
          label="Volumen"
          value={`${sample.volume} cm³`}
          icon={
            <FlaskConical size={19} />
          }
        />

        <DetailCard
          label="Área ocupada"
          value={`${sample.area} cm²`}
          icon={
            <FlaskConical size={19} />
          }
        />
      </section>

      {/* Location */}
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Almacenamiento
            </p>

            <h2 className="mt-2 text-xl font-black text-primary">
              Ubicación actual
            </h2>
          </div>

          {canMove && (
            <button
              type="button"
              onClick={onMove}
              className="flex w-fit items-center gap-2 rounded-2xl bg-accent px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            >
              <MoveRight size={18} />
              Mover muestra
            </button>
          )}
        </div>

        {hasLocation ? (
          <Link
            href={`/locations/${sample.locationId}`}
            className="mt-5 flex items-center gap-4 rounded-2xl border border-border bg-white p-4 transition hover:border-accent"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <MapPin size={19} />
            </div>

            <div>
              <p className="font-black text-primary">
                {sample.locationCode}
              </p>

              <p className="mt-1 text-sm text-secondary">
                {sample.locationName}
              </p>
            </div>
          </Link>
        ) : (
          <div className="mt-5 flex items-center gap-4 rounded-2xl border border-dashed border-border bg-white p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-secondary">
              <MapPin size={19} />
            </div>

            <div>
              <p className="font-bold text-primary">
                Sin ubicación asignada
              </p>

              <p className="mt-1 text-sm text-secondary">
                Esta muestra no se
                encuentra actualmente
                almacenada en una
                ubicación.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Dates */}
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Fechas
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4">
            <CalendarDays
              size={19}
              className="text-accent"
            />

            <div>
              <p className="text-xs font-bold text-secondary">
                Fecha de ingreso
              </p>

              <p className="mt-1 font-bold text-primary">
                {formatDate(
                  sample.entryDate
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4">
            <CalendarDays
              size={19}
              className="text-accent"
            />

            <div>
              <p className="text-xs font-bold text-secondary">
                Fecha de vencimiento
              </p>

              <p className="mt-1 font-bold text-primary">
                {formatDate(
                  sample.expirationDate
                ) || "-"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ======================================================
// DETAIL CARD
// ======================================================

function DetailCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
          {icon}
        </div>

        <div>
          <p className="text-xs font-bold text-secondary">
            {label}
          </p>

          <p className="mt-1 text-xl font-black text-primary">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}