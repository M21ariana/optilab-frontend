"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  ReportExpiration,
} from "@/lib/graphql/reports";

// ----------------------------------------
// TYPES
// ----------------------------------------

type ExpirationChartProps = {
  data: ReportExpiration[];
};

// ----------------------------------------
// HELPERS
// ----------------------------------------

function getExpirationCount(
  data: ReportExpiration[],
  range: string
) {
  return (
    data.find(
      (item) => item.range === range
    )?.count ?? 0
  );
}

// ----------------------------------------
// COMPONENT
// ----------------------------------------

export function ExpirationChart({
  data,
}: ExpirationChartProps) {
  const expired = getExpirationCount(
    data,
    "EXPIRED"
  );

  const next7Days = getExpirationCount(
    data,
    "NEXT_7_DAYS"
  );

  const next30Days = getExpirationCount(
    data,
    "NEXT_30_DAYS"
  );

  const later = getExpirationCount(
    data,
    "LATER"
  );

  const chartData = [
    {
      period: "Vencidas",
      samples: expired,
    },
    {
      period: "1–7 días",
      samples: next7Days,
    },
    {
      period: "8–30 días",
      samples: next30Days,
    },
    {
      period: "Más de 30 días",
      samples: later,
    },
  ];

  const hasData = chartData.some(
    (item) => item.samples > 0
  );

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Vencimientos
        </p>

        <h2 className="mt-2 text-xl font-black text-primary">
          Estado de expiraciones
        </h2>

        <p className="mt-2 text-sm text-secondary">
          Visualiza la distribución de las
          muestras según su fecha de expiración.
        </p>
      </div>

      {hasData ? (
        <div
          className="mt-6 w-full"
          style={{ height: 320 }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="period"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                formatter={(value) => [
                  `${value} muestras`,
                  "Cantidad",
                ]}
              />

              <Bar
                dataKey="samples"
                name="Muestras"
                fill="#E76F51"
                radius={[8, 8, 0, 0]}
                barSize={55}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="mt-6 flex h-80 items-center justify-center rounded-2xl border border-dashed border-border">
          <p className="text-sm text-secondary">
            No hay muestras con fecha de
            expiración registrada.
          </p>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ExpirationSummary
          label="Vencidas"
          value={expired.toString()}
          level="critical"
        />

        <ExpirationSummary
          label="Próximos 7 días"
          value={next7Days.toString()}
          level="critical"
        />

        <ExpirationSummary
          label="Entre 8 y 30 días"
          value={next30Days.toString()}
          level="warning"
        />

        <ExpirationSummary
          label="Más de 30 días"
          value={later.toString()}
          level="default"
        />
      </div>
    </section>
  );
}

// ----------------------------------------
// EXPIRATION SUMMARY
// ----------------------------------------

function ExpirationSummary({
  label,
  value,
  level,
}: {
  label: string;
  value: string;
  level:
    | "critical"
    | "warning"
    | "default";
}) {
  const styles = {
    critical:
      "bg-danger/10 text-danger",

    warning:
      "bg-warning/15 text-warning",

    default:
      "bg-accent/10 text-accent",
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <p className="text-xs font-bold text-secondary">
        {label}
      </p>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-2xl font-black text-primary">
          {value}
        </p>

        <span
          className={`rounded-full px-3 py-1 text-xs font-extrabold ${styles[level]}`}
        >
          Muestras
        </span>
      </div>
    </div>
  );
}