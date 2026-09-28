import Link from "next/link";

import {
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

import type {
  ReportCriticalLocation,
} from "@/lib/graphql/reports";

// ----------------------------------------
// TYPES
// ----------------------------------------

type CriticalLocationsTableProps = {
  data: ReportCriticalLocation[];
};

// ----------------------------------------
// COMPONENT
// ----------------------------------------

export function CriticalLocationsTable({
  data,
}: CriticalLocationsTableProps) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-warning/15 text-warning">
          <AlertTriangle size={21} />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Capacidad
          </p>

          <h2 className="mt-2 text-xl font-black text-primary">
            Ubicaciones con ocupación crítica
          </h2>

          <p className="mt-2 text-sm text-secondary">
            Ubicaciones que han alcanzado o
            superado el 90% de su capacidad.
          </p>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[680px] border-collapse bg-white text-left text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wider text-secondary">
              <tr>
                <th className="px-5 py-4">
                  Código
                </th>

                <th className="px-5 py-4">
                  Ubicación
                </th>

                <th className="px-5 py-4">
                  Muestras
                </th>

                <th className="px-5 py-4">
                  Ocupación
                </th>

                <th className="px-5 py-4 text-right">
                  Detalle
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {data.map((location) => (
                <tr
                  key={location.locationId}
                  className="transition hover:bg-background/60"
                >
                  <td className="px-5 py-4 font-black text-primary">
                    {location.code}
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-bold text-primary">
                      {location.name}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-secondary">
                    {location.sampleCount}
                  </td>

                  <td className="px-5 py-4">
                    <OccupancyStatus
                      occupancy={
                        location.occupancy
                      }
                    />
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/locations/${location.locationId}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-accent transition hover:translate-x-1"
                    >
                      Ver ubicación

                      <ArrowRight
                        size={16}
                      />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-border">
          <div className="text-center">
            <p className="font-bold text-primary">
              No hay ubicaciones críticas
            </p>

            <p className="mt-1 text-sm text-secondary">
              Ninguna ubicación ha alcanzado
              el 90% de ocupación.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

// ----------------------------------------
// OCCUPANCY STATUS
// ----------------------------------------

function OccupancyStatus({
  occupancy,
}: {
  occupancy: number;
}) {
  const formattedOccupancy =
    Number.isInteger(occupancy)
      ? occupancy.toString()
      : occupancy.toFixed(1);

  const style =
    occupancy >= 100
      ? "bg-danger/10 text-danger"
      : "bg-warning/15 text-warning";

  const progressStyle =
    occupancy >= 100
      ? "bg-danger"
      : "bg-warning";

  return (
    <div className="flex items-center gap-3">
      <span
        className={`rounded-full px-3 py-1 text-xs font-extrabold ${style}`}
      >
        {formattedOccupancy}%
      </span>

      <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${progressStyle}`}
          style={{
            width: `${Math.min(
              occupancy,
              100
            )}%`,
          }}
        />
      </div>
    </div>
  );
}