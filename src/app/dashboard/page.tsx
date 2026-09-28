import { AppLayout } from "@/components/layout/AppLayout";

import { ActivityItem } from "@/components/dashboard/ActivityItem";
import { DashboardLaboratoryDropdown } from "@/components/dashboard/DashboardLaboratoryDropdown";
import { SummaryItem } from "@/components/dashboard/SummaryItem";

import { MetricCard } from "@/components/ui/MetricCard";

import {
  AlertTriangle,
  BarChart3,
  Boxes,
  FlaskConical,
  MapPin,
  MoveRight,
} from "lucide-react";

import {
  notFound,
  redirect,
} from "next/navigation";

import { auth0 } from "@/lib/auth0";
import { graphqlRequest } from "@/lib/graphql/client";

import {
  DASHBOARD_QUERY,
  type DashboardActivity,
  type DashboardResponse,
} from "@/lib/graphql/dashboard";

import {
  LABORATORIES_QUERY,
  type LaboratoriesResponse,
} from "@/lib/graphql/sampleOptions";

import {
  ME_QUERY,
  type MeResponse,
} from "@/lib/graphql/profile";

// ======================================================
// HELPERS
// ======================================================

function formatArea(
  areaCm2: number
) {
  const areaM2 =
    areaCm2 / 10_000;

  return new Intl.NumberFormat(
    "es-CO",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(areaM2);
}

function formatPercentage(
  value: number
) {
  return new Intl.NumberFormat(
    "es-CO",
    {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }
  ).format(value);
}

function formatRelativeTime(
  date: string
) {
  const createdAt =
    new Date(date);

  const now =
    new Date();

  const differenceMs =
    now.getTime() -
    createdAt.getTime();

  const differenceMinutes =
    Math.floor(
      differenceMs / 60_000
    );

  if (
    differenceMinutes < 1
  ) {
    return "Ahora";
  }

  if (
    differenceMinutes < 60
  ) {
    return `Hace ${differenceMinutes} min`;
  }

  const differenceHours =
    Math.floor(
      differenceMinutes / 60
    );

  if (
    differenceHours < 24
  ) {
    return `Hace ${differenceHours} ${differenceHours === 1
        ? "hora"
        : "horas"
      }`;
  }

  const differenceDays =
    Math.floor(
      differenceHours / 24
    );

  if (
    differenceDays < 30
  ) {
    return `Hace ${differenceDays} ${differenceDays === 1
        ? "día"
        : "días"
      }`;
  }

  return new Intl.DateTimeFormat(
    "es-CO",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  ).format(createdAt);
}

function getActivityType(
  type: DashboardActivity["type"]
):
  | "sample"
  | "movement"
  | "alert"
  | "location" {
  switch (type) {
    case "SAMPLE":
      return "sample";

    case "MOVEMENT":
      return "movement";

    case "ALERT":
      return "alert";

    case "LOCATION":
      return "location";

    default:
      return "sample";
  }
}

// ======================================================
// PAGE
// ======================================================

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    laboratoryId?: string;
  }>;
}) {
  // ------------------------------------------------------
  // AUTH
  // ------------------------------------------------------

  const session =
    await auth0.getSession();

  if (!session) {
    redirect(
      "/auth/login?returnTo=/dashboard"
    );
  }

  const { token } =
    await auth0.getAccessToken();

  if (!token) {
    throw new Error(
      "No se encontró una sesión autenticada."
    );
  }

  // ------------------------------------------------------
  // SEARCH PARAMS
  // ------------------------------------------------------

  const params =
    await searchParams;

  let laboratoryId:
    | number
    | undefined;

  if (
    params.laboratoryId
  ) {
    const parsedLaboratoryId =
      Number(
        params.laboratoryId
      );

    if (
      !Number.isInteger(
        parsedLaboratoryId
      ) ||
      parsedLaboratoryId <= 0
    ) {
      notFound();
    }

    laboratoryId =
      parsedLaboratoryId;
  }

  // ------------------------------------------------------
  // CURRENT USER
  // ------------------------------------------------------

  const meResult =
    await graphqlRequest<MeResponse>(
      ME_QUERY,
      undefined,
      token
    );

  const currentUser =
    meResult.me;

  if (!currentUser) {
    throw new Error(
      "No fue posible cargar el usuario actual."
    );
  }

  if (!currentUser.organization) {
    throw new Error(
      "El usuario actual no pertenece a una organización."
    );
  }

  const organizationId =
    Number(
      currentUser.organization.id
    );

  if (
    !Number.isInteger(
      organizationId
    ) ||
    organizationId <= 0
  ) {
    throw new Error(
      "La organización del usuario no es válida."
    );
  }

  // ------------------------------------------------------
  // DASHBOARD + LABORATORIES
  // ------------------------------------------------------

  const [
    dashboardResult,
    laboratoriesResult,
  ] = await Promise.all([
    graphqlRequest<DashboardResponse>(
      DASHBOARD_QUERY,
      {
        laboratoryId:
          laboratoryId ?? null,
      },
      token
    ),

    graphqlRequest<LaboratoriesResponse>(
      LABORATORIES_QUERY,
      {
        where: {
          AND: [
            {
              organizationId: {
                equals:
                  organizationId,
              },
            },
          ],
        },
      },
      token
    ),
  ]);

  const dashboard =
    dashboardResult.dashboard;

  // ------------------------------------------------------
  // VALIDATE LABORATORIES RESPONSE
  // ------------------------------------------------------

  if (
    laboratoriesResult
      .laboratories
      .status !== 200
  ) {
    throw new Error(
      laboratoriesResult
        .laboratories
        .error ??
      "No fue posible cargar los laboratorios."
    );
  }

  const laboratories =
    laboratoriesResult
      .laboratories
      .data ?? [];

  // ------------------------------------------------------
  // VALIDATE SELECTED LABORATORY
  // ------------------------------------------------------

  if (
    laboratoryId !==
    undefined
  ) {
    const laboratoryExists =
      laboratories.some(
        (laboratory) =>
          Number(
            laboratory.id
          ) === laboratoryId
      );

    if (
      !laboratoryExists
    ) {
      notFound();
    }
  }

  // ------------------------------------------------------
  // SUMMARY
  // ------------------------------------------------------

  const summaryItems = [
    {
      label:
        "Laboratorios",

      value: String(
        dashboard
          .laboratoryCount
      ),

      icon: (
        <Boxes size={18} />
      ),
    },
    {
      label:
        "Tipos de material",

      value: String(
        dashboard
          .materialTypeCount
      ),

      icon: (
        <FlaskConical
          size={18}
        />
      ),
    },
    {
      label:
        "Área total",

      value: `${formatArea(
        dashboard
          .totalAreaCm2
      )} m²`,

      icon: (
        <MapPin size={18} />
      ),
    },
    {
      label:
        "Área disponible",

      value: `${formatArea(
        dashboard
          .availableAreaCm2
      )} m²`,

      icon: (
        <MapPin size={18} />
      ),
    },
  ];

  // ------------------------------------------------------
  // RENDER
  // ------------------------------------------------------

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}

        <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
              Dashboard
            </p>

            <h1 className="mt-2 text-4xl font-black text-primary">
              Vista general
            </h1>

            <p className="mt-2 text-secondary">
              {dashboard.scope ===
                "ORGANIZATION"
                ? "Estado general de los laboratorios de tu organización."
                : "Estado general del laboratorio seleccionado."}
            </p>
          </div>

          <DashboardLaboratoryDropdown
            laboratories={
              laboratories
            }
            selectedLaboratoryId={
              laboratoryId ??
              null
            }
          />
        </section>

        {/* Main metrics */}

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Muestras activas"
            value={String(
              dashboard
                .activeSamples
            )}
            icon={
              <FlaskConical
                size={22}
              />
            }
            subtitle={`+${dashboard.samplesCreatedThisMonth} este mes`}
            interactive={
              false
            }
          />

          <MetricCard
            title="Espacio utilizado"
            value={`${formatPercentage(
              dashboard
                .areaUsagePercentage
            )}%`}
            icon={
              <Boxes
                size={22}
              />
            }
            subtitle={`${formatArea(
              dashboard
                .usedAreaCm2
            )} m² ocupados`}
            interactive={
              false
            }
          />

          <MetricCard
            title="Alertas pendientes"
            value={String(
              dashboard
                .pendingAlerts
            )}
            icon={
              <AlertTriangle
                size={22}
              />
            }
            subtitle={`${dashboard.criticalAlerts} críticas`}
            variant={
              dashboard
                .criticalAlerts >
                0
                ? "danger"
                : dashboard
                  .pendingAlerts >
                  0
                  ? "warning"
                  : "default"
            }
            interactive={
              false
            }
          />

          <MetricCard
            title="Movimientos hoy"
            value={String(
              dashboard
                .movementsToday
            )}
            icon={
              <MoveRight
                size={22}
              />
            }
            subtitle="Actividad diaria"
            interactive={
              false
            }
          />
        </section>

        {/* Activity + Summary */}

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Recent activity */}

          <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Actividad
              </p>

              <h2 className="mt-2 text-xl font-black text-primary">
                Actividad reciente
              </h2>

              <p className="mt-1 text-sm text-secondary">
                Últimos cambios
                registrados
                {dashboard.scope ===
                  "LABORATORY"
                  ? " en el laboratorio."
                  : " en la organización."}
              </p>
            </div>

            <div className="mt-6 divide-y divide-border">
              {dashboard
                .recentActivity
                .map(
                  (item) => (
                    <ActivityItem
                      key={
                        item.id
                      }
                      title={
                        item.title
                      }
                      description={
                        item.description
                      }
                      time={formatRelativeTime(
                        item.createdAt
                      )}
                      type={getActivityType(
                        item.type
                      )}
                    />
                  )
                )}

              {dashboard
                .recentActivity
                .length ===
                0 && (
                  <div className="py-10 text-center">
                    <p className="text-sm font-bold text-primary">
                      No hay
                      actividad
                      reciente
                    </p>

                    <p className="mt-1 text-sm text-secondary">
                      Los nuevos
                      registros,
                      movimientos y
                      alertas
                      aparecerán
                      aquí.
                    </p>
                  </div>
                )}
            </div>
          </div>

          {/* General summary */}

          <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Resumen
              </p>

              <h2 className="mt-2 flex items-center gap-3 text-xl font-black text-primary">
                <BarChart3
                  size={22}
                />

                Resumen general
              </h2>

              <p className="mt-1 text-sm text-secondary">
                {dashboard.scope ===
                  "ORGANIZATION"
                  ? "Estado general de la organización."
                  : "Estado general del laboratorio."}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {summaryItems.map(
                (item) => (
                  <SummaryItem
                    key={
                      item.label
                    }
                    label={
                      item.label
                    }
                    value={
                      item.value
                    }
                    icon={
                      item.icon
                    }
                  />
                )
              )}
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}