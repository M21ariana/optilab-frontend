import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/ui/MetricCard";

import Link from "next/link";

import {
  AlertTriangle,
  CalendarClock,
  FlaskConical,
  MapPin,
  ShieldAlert,
  ThermometerSnowflake,
} from "lucide-react";

import { redirect } from "next/navigation";

import { auth0 } from "@/lib/auth0";
import { graphqlRequest } from "@/lib/graphql/client";

import {
  ALERTS_QUERY,
  type AlertsResponse,
} from "@/lib/graphql/alerts";

// ----------------------------------------
// PAGE
// ----------------------------------------

export default async function AlertsPage() {
  // ----------------------------------------
  // AUTH
  // ----------------------------------------

  const session =
    await auth0.getSession();

  if (!session) {
    redirect(
      "/auth/login?returnTo=/alerts"
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
  // ALERTS
  // ----------------------------------------

  const result =
    await graphqlRequest<AlertsResponse>(
      ALERTS_QUERY,
      {
        where: {
          isResolved: {
            equals: false,
          },
        },

        orderBy: {
          field: "createdAt",
          value: "desc",
        },
      },
      token
    );

  const alerts =
    result.alerts.data ?? [];

  // ----------------------------------------
  // GROUP ALERTS
  // ----------------------------------------

  const occupancyAlerts =
    alerts.filter(
      (alert) =>
        alert.alertType ===
        "HIGH_OCCUPANCY"
    );

  const expirationAlerts =
    alerts.filter(
      (alert) =>
        alert.alertType ===
          "EXPIRATION" ||
        alert.alertType ===
          "EXPIRATION_WARNING"
    );

  const storageRequirementAlerts =
    alerts.filter(
      (alert) =>
        alert.alertType ===
        "STORAGE_REQUIREMENT"
    );

  const hazardousAlerts =
    alerts.filter(
      (alert) =>
        alert.alertType ===
        "HAZARDOUS_MATERIAL"
    );

  const totalAlerts = alerts.length;

  const storageAlertsCount =
    storageRequirementAlerts.length +
    hazardousAlerts.length;

  // ----------------------------------------
  // RENDER
  // ----------------------------------------

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}

        <section>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
            Monitoreo
          </p>

          <h1 className="mt-2 text-4xl font-black text-primary">
            Alertas
          </h1>

          <p className="mt-2 max-w-2xl text-secondary">
            Revisa las condiciones de
            almacenamiento, ocupación y
            vencimiento de las muestras.
          </p>
        </section>

        {/* Summary */}

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Alertas totales"
            value={totalAlerts.toString()}
            subtitle="Requieren atención"
            icon={
              <AlertTriangle size={20} />
            }
            variant="warning"
            compact
          />

          <MetricCard
            title="Alta ocupación"
            value={occupancyAlerts.length.toString()}
            subtitle="Ubicaciones"
            icon={
              <MapPin size={20} />
            }
            variant="warning"
            compact
          />

          <MetricCard
            title="Vencimiento"
            value={expirationAlerts.length.toString()}
            subtitle="Muestras"
            icon={
              <CalendarClock size={20} />
            }
            variant="warning"
            compact
          />

          <MetricCard
            title="Almacenamiento"
            value={storageAlertsCount.toString()}
            subtitle="Condiciones incompatibles"
            icon={
              <ThermometerSnowflake
                size={20}
              />
            }
            variant="warning"
            compact
          />
        </section>

        {/* ======================================== */}
        {/* HIGH OCCUPANCY */}
        {/* ======================================== */}

        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-warning/15 text-warning">
              <MapPin size={21} />
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">
                Alta ocupación de espacios
              </h2>

              <p className="mt-1 text-sm text-secondary">
                Ubicaciones que están cerca de
                alcanzar su capacidad máxima.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {occupancyAlerts.map(
              (alert) => {
                const location =
                  alert.storageLocation;

                if (!location) {
                  return null;
                }

                return (
                  <Link
                    key={alert.id}
                    href={`/locations/${location.id}`}
                    className="group block rounded-2xl border border-border bg-white p-5 transition hover:border-warning/50 hover:shadow-sm"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-warning/15 text-warning">
                        <AlertTriangle
                          size={20}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="font-black text-primary">
                            {location.code}
                          </p>

                          <span className="rounded-full bg-warning/15 px-3 py-1 text-xs font-extrabold text-warning">
                            {location.occupancy}%{" "}
                            ocupado
                          </span>
                        </div>

                        <p className="mt-1 font-bold text-primary">
                          {location.name}
                        </p>

                        <p className="mt-2 text-sm text-secondary">
                          {alert.message}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              }
            )}

            {occupancyAlerts.length ===
              0 && (
              <EmptyState message="No hay alertas de alta ocupación pendientes." />
            )}
          </div>
        </section>

        {/* ======================================== */}
        {/* EXPIRATION */}
        {/* ======================================== */}

        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <CalendarClock size={21} />
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">
                Vencimiento de muestras
              </h2>

              <p className="mt-1 text-sm text-secondary">
                Muestras vencidas o próximas a
                alcanzar su fecha de expiración.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {expirationAlerts.map(
              (alert) => {
                const sample =
                  alert.sample;

                if (!sample) {
                  return null;
                }

                const daysRemaining =
                  getDaysRemaining(
                    sample.expirationDate
                  );

                const isExpired =
                  alert.alertType ===
                    "EXPIRATION" ||
                  (daysRemaining !== null &&
                    daysRemaining <= 0);

                return (
                  <Link
                    key={alert.id}
                    href={`/samples/${sample.id}`}
                    className="group block rounded-2xl border border-border bg-white p-5 transition hover:border-danger/40 hover:shadow-sm"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
                        <FlaskConical
                          size={20}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="font-black text-primary">
                            {sample.code}
                          </p>

                          {daysRemaining !==
                            null && (
                            <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-extrabold text-danger">
                              {isExpired
                                ? "Vencida"
                                : `${daysRemaining} días restantes`}
                            </span>
                          )}
                        </div>

                        <p className="mt-1 font-bold text-primary">
                          {sample.name}
                        </p>

                        <p className="mt-2 text-sm text-secondary">
                          {alert.message}
                        </p>

                        {sample.expirationDate && (
                          <p className="mt-2 text-xs font-bold text-secondary">
                            Fecha de
                            expiración:{" "}
                            {formatDate(
                              sample.expirationDate
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              }
            )}

            {expirationAlerts.length ===
              0 && (
              <EmptyState message="No hay alertas de vencimiento pendientes." />
            )}
          </div>
        </section>

        {/* ======================================== */}
        {/* STORAGE REQUIREMENTS */}
        {/* ======================================== */}

        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-warning/15 text-warning">
              <ThermometerSnowflake
                size={21}
              />
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">
                Condiciones de almacenamiento
              </h2>

              <p className="mt-1 text-sm text-secondary">
                Muestras almacenadas en
                ubicaciones que no cumplen con
                sus condiciones requeridas.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {storageRequirementAlerts.map(
              (alert) => {
                const sample =
                  alert.sample;

                const location =
                  alert.storageLocation;

                if (!sample) {
                  return null;
                }

                return (
                  <Link
                    key={alert.id}
                    href={`/samples/${sample.id}`}
                    className="group block rounded-2xl border border-border bg-white p-5 transition hover:border-warning/50 hover:shadow-sm"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-warning/15 text-warning">
                        <ThermometerSnowflake
                          size={20}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="font-black text-primary">
                            {sample.code}
                          </p>

                          <span className="rounded-full bg-warning/15 px-3 py-1 text-xs font-extrabold text-warning">
                            Condición incompatible
                          </span>
                        </div>

                        <p className="mt-1 font-bold text-primary">
                          {sample.name}
                        </p>

                        <p className="mt-2 text-sm text-secondary">
                          {alert.message}
                        </p>

                        {location && (
                          <p className="mt-2 text-xs font-bold text-secondary">
                            Ubicación actual:{" "}
                            {location.code} —{" "}
                            {location.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              }
            )}

            {storageRequirementAlerts.length ===
              0 && (
              <EmptyState message="No hay incompatibilidades de almacenamiento pendientes." />
            )}
          </div>
        </section>

        {/* ======================================== */}
        {/* HAZARDOUS MATERIAL */}
        {/* ======================================== */}

        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <ShieldAlert size={21} />
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">
                Materiales peligrosos
              </h2>

              <p className="mt-1 text-sm text-secondary">
                Muestras peligrosas almacenadas
                en ubicaciones que no están
                habilitadas para este tipo de
                material.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {hazardousAlerts.map(
              (alert) => {
                const sample =
                  alert.sample;

                const location =
                  alert.storageLocation;

                if (!sample) {
                  return null;
                }

                return (
                  <Link
                    key={alert.id}
                    href={`/samples/${sample.id}`}
                    className="group block rounded-2xl border border-border bg-white p-5 transition hover:border-danger/40 hover:shadow-sm"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
                        <ShieldAlert
                          size={20}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="font-black text-primary">
                            {sample.code}
                          </p>

                          <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-extrabold text-danger">
                            Material peligroso
                          </span>
                        </div>

                        <p className="mt-1 font-bold text-primary">
                          {sample.name}
                        </p>

                        <p className="mt-2 text-sm text-secondary">
                          {alert.message}
                        </p>

                        {location && (
                          <p className="mt-2 text-xs font-bold text-secondary">
                            Ubicación actual:{" "}
                            {location.code} —{" "}
                            {location.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              }
            )}

            {hazardousAlerts.length ===
              0 && (
              <EmptyState message="No hay alertas de materiales peligrosos pendientes." />
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

// ----------------------------------------
// HELPERS
// ----------------------------------------

function getDaysRemaining(
  expirationDate: string | null
) {
  if (!expirationDate) {
    return null;
  }

  const expiration =
    new Date(expirationDate);

  const today =
    new Date();

  expiration.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const difference =
    expiration.getTime() -
    today.getTime();

  return Math.ceil(
    difference /
      (1000 * 60 * 60 * 24)
  );
}

function formatDate(
  date: string
) {
  return new Intl.DateTimeFormat(
    "es-CO",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }
  ).format(new Date(date));
}

// ----------------------------------------
// EMPTY STATE
// ----------------------------------------

function EmptyState({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background px-5 py-8 text-center">
      <p className="text-sm font-medium text-secondary">
        {message}
      </p>
    </div>
  );
}