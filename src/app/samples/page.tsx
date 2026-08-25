import { AppLayout } from "@/components/layout/AppLayout";
import {
  Filter,
  FlaskConical,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";

const samples = [
  {
    id: "RES-001",
    code: "RES-001",
    name: "Muestra Resina A",
    type: "Resina",
    location: "A1",
    weight: "500 g",
    expirationDate: "02/09/2026",
    status: "ACTIVE",
  },
  {
    id: "POL-014",
    code: "POL-014",
    name: "Polímero Experimental B",
    type: "Polímero",
    location: "A2",
    weight: "350 g",
    expirationDate: null,
    status: "ACTIVE",
  },
  {
    id: "CHE-220",
    code: "CHE-220",
    name: "Solución Química C",
    type: "Sustancia química",
    location: "G1",
    weight: "120 g",
    expirationDate: "28/08/2026",
    status: "ARCHIVED",
  },
];

export default function SamplesPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
              Inventario
            </p>

            <h1 className="mt-2 text-4xl font-black text-primary">
              Muestras
            </h1>

            <p className="mt-2 text-secondary">
              Consulta, filtra y gestiona las muestras registradas en el
              laboratorio activo.
            </p>
          </div>

          <Link
            href="/samples/new"
            className="flex items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-accent/20 transition hover:opacity-90"
          >
            <Plus size={18} />
            Nueva muestra
          </Link>
        </section>

        {/* Content */}
        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          {/* Search / filter */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 lg:max-w-md">
              <Search
                size={18}
                className="text-accent"
              />

              <input
                placeholder="Buscar por nombre, código o ubicación..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-secondary/50"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-bold text-primary transition hover:border-accent"
              >
                <Filter size={18} />
                Filtrar
              </button>

              <button
                type="button"
                className="flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-bold text-primary transition hover:border-accent"
              >
                <SlidersHorizontal size={18} />
                Ordenar
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[950px] border-collapse bg-white text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-wider text-secondary">
                <tr>
                  <th className="px-5 py-4">
                    Código
                  </th>

                  <th className="px-5 py-4">
                    Muestra
                  </th>

                  <th className="px-5 py-4">
                    Tipo
                  </th>

                  <th className="px-5 py-4">
                    Ubicación
                  </th>

                  <th className="px-5 py-4">
                    Peso
                  </th>

                  <th className="px-5 py-4">
                    Vencimiento
                  </th>

                  <th className="px-5 py-4">
                    Estado
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {samples.map((sample) => (
                  <tr
                    key={sample.id}
                    className="transition hover:bg-background/60"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/samples/${sample.id}`}
                        className="font-bold text-primary transition hover:text-accent"
                      >
                        {sample.code}
                      </Link>
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/samples/${sample.id}`}
                        className="group flex items-center gap-3"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                          <FlaskConical size={18} />
                        </div>

                        <div>
                          <p className="font-bold text-primary transition group-hover:text-accent">
                            {sample.name}
                          </p>

                          <p className="text-xs text-secondary">
                            Registro de inventario
                          </p>
                        </div>
                      </Link>
                    </td>

                    <td className="px-5 py-4 text-secondary">
                      {sample.type}
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/locations/${sample.location.toLowerCase()}`}
                        className="font-bold text-primary transition hover:text-accent"
                      >
                        {sample.location}
                      </Link>
                    </td>

                    <td className="px-5 py-4 text-secondary">
                      {sample.weight}
                    </td>

                    <td className="px-5 py-4 text-secondary">
                      {sample.expirationDate ?? "No aplica"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                          sample.status === "ACTIVE"
                            ? "bg-accent/10 text-accent"
                            : "bg-secondary/10 text-secondary"
                        }`}
                      >
                        {sample.status === "ACTIVE"
                          ? "ACTIVA"
                          : "ARCHIVADA"}
                      </span>
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