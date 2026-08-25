import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

const locations = [
  {
    id: "a1",
    code: "A1",
    name: "Estantería A - Nivel superior",
    sampleCount: 9,
    capacity: 10,
    occupancy: 92,
  },
  {
    id: "g1",
    code: "G1",
    name: "Gabinete 2 - Compartimiento superior",
    sampleCount: 9,
    capacity: 10,
    occupancy: 90,
  },
  {
    id: "f1",
    code: "F1",
    name: "Nevera 1 - Bandeja superior",
    sampleCount: 8,
    capacity: 10,
    occupancy: 80,
  },
  {
    id: "g2",
    code: "G2",
    name: "Gabinete 2 - Compartimiento inferior",
    sampleCount: 8,
    capacity: 10,
    occupancy: 80,
  },
];

export function CriticalLocationsTable() {
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
            Ubicaciones con mayor ocupación
          </h2>

          <p className="mt-2 text-sm text-secondary">
            Identifica las ubicaciones que están más cerca de alcanzar su
            capacidad máxima.
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[760px] border-collapse bg-white text-left text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wider text-secondary">
            <tr>
              <th className="px-5 py-4">Código</th>
              <th className="px-5 py-4">Ubicación</th>
              <th className="px-5 py-4">Muestras</th>
              <th className="px-5 py-4">Capacidad</th>
              <th className="px-5 py-4">Ocupación</th>
              <th className="px-5 py-4 text-right">Detalle</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {locations.map((location) => (
              <tr
                key={location.id}
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

                <td className="px-5 py-4 text-secondary">
                  {location.capacity}
                </td>

                <td className="px-5 py-4">
                  <OccupancyStatus occupancy={location.occupancy} />
                </td>

                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/locations/${location.id}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-accent transition hover:translate-x-1"
                  >
                    Ver ubicación
                    <ArrowRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function OccupancyStatus({
  occupancy,
}: {
  occupancy: number;
}) {
  const style =
    occupancy >= 86
      ? "bg-danger/10 text-danger"
      : occupancy >= 61
        ? "bg-warning/15 text-warning"
        : "bg-accent/10 text-accent";

  return (
    <div className="flex items-center gap-3">
      <span
        className={`rounded-full px-3 py-1 text-xs font-extrabold ${style}`}
      >
        {occupancy}%
      </span>

      <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${
            occupancy >= 86
              ? "bg-danger"
              : occupancy >= 61
                ? "bg-warning"
                : "bg-accent"
          }`}
          style={{ width: `${Math.min(occupancy, 100)}%` }}
        />
      </div>
    </div>
  );
}