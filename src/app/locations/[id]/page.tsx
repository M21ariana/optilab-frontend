import Link from "next/link";

import {
  ArrowLeft,
  Biohazard,
  Edit3,
  FlaskConical,
  LightbulbOff,
  MapPin,
  PackageOpen,
  Refrigerator,
  Scale,
} from "lucide-react";

import {
  notFound,
  redirect,
} from "next/navigation";

import { AppLayout } from "@/components/layout/AppLayout";
import { OccupancyBadge } from "@/components/locations/OccupancyBadge";
import { ProgressBar } from "@/components/locations/ProgressBar";

import { auth0 } from "@/lib/auth0";
import { graphqlRequest } from "@/lib/graphql/client";

import {
  STORAGE_LOCATION_QUERY,
  type StorageLocationResponse,
} from "@/lib/graphql/locations";

type LocationDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LocationDetailPage({
  params,
}: LocationDetailPageProps) {
  // ----------------------------------------
  // PARAMS
  // ----------------------------------------

  const { id } = await params;

  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    notFound();
  }

  // ----------------------------------------
  // AUTH
  // ----------------------------------------

  const session =
    await auth0.getSession();

  if (!session) {
    redirect(
      `/auth/login?returnTo=/locations/${id}`
    );
  }

  const { token } =
    await auth0.getAccessToken();

  if (!token) {
    throw new Error(
      "Could not obtain an Auth0 access token."
    );
  }

  // ----------------------------------------
  // LOCATION
  // ----------------------------------------

  const {
    storageLocation: location,
  } =
    await graphqlRequest<StorageLocationResponse>(
      STORAGE_LOCATION_QUERY,
      {
        id: numericId,
      },
      token
    );

  if (!location) {
    notFound();
  }

  // ----------------------------------------
  // CALCULATIONS
  // ----------------------------------------

  const maxArea =
    location.maxAreaCm2 ?? 0;

  const usedArea =
    location.usedAreaCm2;

  const availableArea =
    Math.max(
      maxArea - usedArea,
      0
    );

  const activeSamples =
    location.samples.filter(
      (sample) =>
        sample.status !== "REMOVED"
    );

  // ----------------------------------------
  // RENDER
  // ----------------------------------------

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

                <OccupancyBadge
                  occupancy={
                    location.occupancy
                  }
                />
              </div>

              <h1 className="mt-3 text-4xl font-black text-primary">
                {location.name}
              </h1>

              <p className="mt-2 text-sm font-bold uppercase tracking-wide text-secondary">
                {location.laboratory.name}
              </p>

              {location.description && (
                <p className="mt-3 max-w-3xl leading-7 text-secondary">
                  {location.description}
                </p>
              )}
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

        {/* Summary */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DetailMetric
            icon={
              <FlaskConical size={21} />
            }
            label="Muestras almacenadas"
            value={location.sampleCount.toString()}
          />

          <DetailMetric
            icon={
              <PackageOpen size={21} />
            }
            label="Área utilizada"
            value={`${formatNumber(
              usedArea
            )} cm²`}
          />

          <DetailMetric
            icon={<MapPin size={21} />}
            label="Área disponible"
            value={
              location.maxAreaCm2 !==
              null
                ? `${formatNumber(
                    availableArea
                  )} cm²`
                : "Sin límite"
            }
          />

          <DetailMetric
            icon={<Scale size={21} />}
            label="Ocupación"
            value={`${location.occupancy.toFixed(
              1
            )}%`}
          />
        </section>

        {/* Capacity */}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-xl font-black text-primary">
              Capacidad de la ubicación
            </h2>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-secondary">
                  Ocupación por área
                </span>

                <span className="text-sm font-black text-primary">
                  {location.occupancy.toFixed(
                    1
                  )}
                  %
                </span>
              </div>

              <ProgressBar
                occupancy={
                  location.occupancy
                }
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <CapacityItem
                label="Volumen máximo"
                value={
                  location.maxVolumeCm3 !==
                  null
                    ? `${formatNumber(
                        location.maxVolumeCm3
                      )} cm³`
                    : "Sin definir"
                }
              />

              <CapacityItem
                label="Área máxima"
                value={
                  location.maxAreaCm2 !==
                  null
                    ? `${formatNumber(
                        location.maxAreaCm2
                      )} cm²`
                    : "Sin definir"
                }
              />

              <CapacityItem
                label="Peso máximo"
                value={
                  location.maxWeightG !==
                  null
                    ? `${formatNumber(
                        location.maxWeightG
                      )} g`
                    : "Sin definir"
                }
              />
            </div>
          </div>

          {/* Storage conditions */}

          <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-xl font-black text-primary">
              Condiciones de almacenamiento
            </h2>

            <p className="mt-2 text-sm leading-6 text-secondary">
              Capacidades especiales disponibles
              en esta ubicación.
            </p>

            <div className="mt-6 space-y-3">
              <ConditionItem
                icon={
                  <Refrigerator
                    size={18}
                  />
                }
                label="Almacenamiento refrigerado"
                enabled={
                  location.supportsColdStorage
                }
              />

              <ConditionItem
                icon={
                  <LightbulbOff
                    size={18}
                  />
                }
                label="Protección contra la luz"
                enabled={
                  location.supportsLightProtection
                }
              />

              <ConditionItem
                icon={
                  <Biohazard size={18} />
                }
                label="Materiales peligrosos"
                enabled={
                  location.supportsHazardous
                }
              />
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
              Muestras asignadas actualmente a
              esta ubicación.
            </p>
          </div>

          {activeSamples.length > 0 ? (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full border-collapse bg-white text-left text-sm">
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
                      Peso
                    </th>

                    <th className="px-5 py-4">
                      Área
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {activeSamples.map(
                    (sample) => (
                      <tr
                        key={sample.id}
                        className="transition hover:bg-background/60"
                      >
                        <td className="px-5 py-4 font-bold text-primary">
                          {sample.code}
                        </td>

                        <td className="px-5 py-4">
                          <Link
                            href={`/samples/${sample.id}`}
                            className="font-bold text-primary transition hover:text-accent"
                          >
                            {sample.name}
                          </Link>
                        </td>

                        <td className="px-5 py-4 text-secondary">
                          {
                            sample
                              .materialType
                              .name
                          }
                        </td>

                        <td className="px-5 py-4 text-secondary">
                          {formatNumber(
                            sample.weightG
                          )}{" "}
                          g
                        </td>

                        <td className="px-5 py-4 text-secondary">
                          {formatNumber(
                            sample.areaCm2
                          )}{" "}
                          cm²
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center">
              <FlaskConical
                size={28}
                className="mx-auto text-secondary"
              />

              <p className="mt-3 font-bold text-primary">
                No hay muestras almacenadas
              </p>

              <p className="mt-1 text-sm text-secondary">
                Esta ubicación se encuentra
                actualmente vacía.
              </p>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

// ----------------------------------------
// HELPERS
// ----------------------------------------

function formatNumber(
  value: number
) {
  return value.toLocaleString(
    "es-CO",
    {
      maximumFractionDigits: 2,
    }
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
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <span className="text-xs font-bold text-secondary">
        {label}
      </span>

      <p className="mt-2 font-black text-primary">
        {value}
      </p>
    </div>
  );
}

function ConditionItem({
  icon,
  label,
  enabled,
}: {
  icon: React.ReactNode;
  label: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-accent">
          {icon}
        </span>

        <span className="text-sm font-bold text-primary">
          {label}
        </span>
      </div>

      <span
        className={
          enabled
            ? "rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent"
            : "rounded-full bg-muted px-3 py-1 text-xs font-bold text-secondary"
        }
      >
        {enabled ? "Sí" : "No"}
      </span>
    </div>
  );
}