import { AppLayout } from "@/components/layout/AppLayout";
import { OccupancyBadge } from "@/components/locations/OccupancyBadge";
import { ProgressBar } from "@/components/locations/ProgressBar";
import Link from "next/link";
import {
  ArrowLeft,
  Edit3,
  FlaskConical,
  MapPin,
  PackageOpen,
  Scale,
  Warehouse,
} from "lucide-react";

const location = {
  id: "a1",
  code: "A1",
  name: "Estantería A - Nivel superior",
  type: "Estantería",
  description:
    "Ubicación destinada a muestras sólidas y materiales estables a temperatura ambiente.",
  allowedTypes: ["Resina", "Polímero"],
  maxVolume: "20,000 cm³",
  maxArea: "5,000 cm²",
  maxWeight: "15,000 g",
  sampleCount: 8,
  capacity: 10,
  occupancy: 80,
};

const samples = [
  {
    code: "RES-001",
    name: "Muestra Resina A",
    type: "Resina",
    weight: "500 g",
  },
  {
    code: "RES-014",
    name: "Resina Experimental B",
    type: "Resina",
    weight: "350 g",
  },
  {
    code: "POL-008",
    name: "Polímero Técnico A",
    type: "Polímero",
    weight: "620 g",
  },
];

export default function LocationDetailPage() {
  const availableSpaces = location.capacity - location.sampleCount;

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <section>
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 text-sm font-bold text-secondary transition hover:text-accent"
          >
            <ArrowLeft size={18} />
            Volver a ubicaciones
          </Link>

          <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-extrabold uppercase tracking-[0.25em] text-accent">
                  {location.code}
                </p>

                <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-secondary">
                  {location.type}
                </span>

                <OccupancyBadge occupancy={location.occupancy} />
              </div>

              <h1 className="mt-3 text-4xl font-black text-primary">
                {location.name}
              </h1>

              <p className="mt-3 max-w-3xl leading-7 text-secondary">
                {location.description}
              </p>
            </div>

            <Link
              href={`/locations/${location.id}/edit`}
              className="flex w-fit items-center gap-2 rounded-2xl border border-border bg-white px-5 py-3 text-sm font-bold text-primary shadow-sm transition hover:border-accent hover:text-accent"
            >
              <Edit3 size={18} />
              Editar ubicación
            </Link>
          </div>
        </section>

        {/* Summary metrics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DetailMetric
            icon={<FlaskConical size={21} />}
            label="Muestras almacenadas"
            value={location.sampleCount.toString()}
          />

          <DetailMetric
            icon={<PackageOpen size={21} />}
            label="Espacios disponibles"
            value={availableSpaces.toString()}
          />

          <DetailMetric
            icon={<Warehouse size={21} />}
            label="Capacidad total"
            value={location.capacity.toString()}
          />

          <DetailMetric
            icon={<MapPin size={21} />}
            label="Ocupación"
            value={`${location.occupancy}%`}
          />
        </section>

        {/* Capacity + allowed types */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-xl font-black text-primary">
              Capacidad de la ubicación
            </h2>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-secondary">
                  Ocupación actual
                </span>

                <span className="text-sm font-black text-primary">
                  {location.occupancy}%
                </span>
              </div>

              <ProgressBar occupancy={location.occupancy} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <CapacityItem
                label="Volumen máximo"
                value={location.maxVolume}
              />

              <CapacityItem
                label="Área máxima"
                value={location.maxArea}
              />

              <CapacityItem
                label="Peso máximo"
                value={location.maxWeight}
                icon={<Scale size={18} />}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-xl font-black text-primary">
              Tipos de muestra permitidos
            </h2>

            <p className="mt-2 text-sm leading-6 text-secondary">
              Esta ubicación está configurada para recibir los siguientes tipos
              de muestra.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {location.allowedTypes.map((type) => (
                <span
                  key={type}
                  className="rounded-full bg-accent/10 px-4 py-2 text-sm font-bold text-accent"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Samples */}
        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-primary">
              Muestras almacenadas
            </h2>

            <p className="mt-2 text-sm text-secondary">
              Muestras asignadas actualmente a esta ubicación.
            </p>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <table className="w-full border-collapse bg-white text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-wider text-secondary">
                <tr>
                  <th className="px-5 py-4">Código</th>
                  <th className="px-5 py-4">Muestra</th>
                  <th className="px-5 py-4">Tipo</th>
                  <th className="px-5 py-4">Peso</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {samples.map((sample) => (
                  <tr
                    key={sample.code}
                    className="transition hover:bg-background/60"
                  >
                    <td className="px-5 py-4 font-bold text-primary">
                      {sample.code}
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/samples/${sample.code}`}
                        className="font-bold text-primary transition hover:text-accent"
                      >
                        {sample.name}
                      </Link>
                    </td>

                    <td className="px-5 py-4 text-secondary">
                      {sample.type}
                    </td>

                    <td className="px-5 py-4 text-secondary">
                      {sample.weight}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function DetailMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
          {icon}
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-secondary">
            {label}
          </p>

          <p className="mt-1 text-2xl font-black text-primary">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function CapacityItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <div className="flex items-center gap-2 text-secondary">
        {icon}

        <span className="text-xs font-bold">
          {label}
        </span>
      </div>

      <p className="mt-2 font-black text-primary">
        {value}
      </p>
    </div>
  );
}