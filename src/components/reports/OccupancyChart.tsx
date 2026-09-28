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
  ReportOccupancyByLocation,
} from "@/lib/graphql/reports";

// ----------------------------------------
// TYPES
// ----------------------------------------

type OccupancyChartProps = {
  data: ReportOccupancyByLocation[];
};

// ----------------------------------------
// COMPONENT
// ----------------------------------------

export function OccupancyChart({
  data,
}: OccupancyChartProps) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Capacidad
        </p>

        <h2 className="mt-2 text-xl font-black text-primary">
          Ocupación por ubicación
        </h2>

        <p className="mt-2 text-sm text-secondary">
          Compara el porcentaje de capacidad
          utilizada en cada ubicación del
          laboratorio.
        </p>
      </div>

      {data.length > 0 ? (
        <div
          className="mt-6 w-full"
          style={{
            height: Math.max(
              320,
              data.length * 48
            ),
          }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 10,
                right: 30,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
              />

              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(value) =>
                  `${value}%`
                }
              />

              <YAxis
                dataKey="code"
                type="category"
                width={55}
              />

              <Tooltip
                formatter={(value) => [
                  `${Number(value).toFixed(
                    1
                  )}%`,
                  "Ocupación",
                ]}
                labelFormatter={(label) => {
                  const item =
                    data.find(
                      (location) =>
                        location.code ===
                        label
                    );

                  return item
                    ? `${item.code} · ${item.name}`
                    : label;
                }}
              />

              <Bar
                dataKey="occupancy"
                fill="#2A9D8F"
                radius={[0, 8, 8, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="mt-6 flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-border">
          <p className="text-sm text-secondary">
            No hay ubicaciones con capacidad
            configurada para mostrar.
          </p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-4 text-xs text-secondary">
        <span>
          0–60% · Disponible
        </span>

        <span>
          61–85% · Ocupación media
        </span>

        <span>
          86–100% · Capacidad alta
        </span>
      </div>
    </section>
  );
}