"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  ReportMovementTrend,
} from "@/lib/graphql/reports";

// ----------------------------------------
// TYPES
// ----------------------------------------

type MovementTrendChartProps = {
  data: ReportMovementTrend[];
};

// ----------------------------------------
// HELPERS
// ----------------------------------------

function formatDate(
  date: string
) {
  const [year, month, day] =
    date.split("-").map(Number);

  const value = new Date(
    year,
    month - 1,
    day
  );

  return new Intl.DateTimeFormat(
    "es-CO",
    {
      day: "2-digit",
      month: "short",
    }
  ).format(value);
}

// ----------------------------------------
// COMPONENT
// ----------------------------------------

export function MovementTrendChart({
  data,
}: MovementTrendChartProps) {
  const chartData = data.map(
    (item) => ({
      ...item,

      label:
        formatDate(item.date),
    })
  );

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Trazabilidad
        </p>

        <h2 className="mt-2 text-xl font-black text-primary">
          Movimientos a lo largo del tiempo
        </h2>

        <p className="mt-2 text-sm text-secondary">
          Visualiza la cantidad de movimientos
          de muestras registrados durante los
          últimos 30 días.
        </p>
      </div>

      {chartData.length > 0 ? (
        <div
          className="mt-6 w-full"
          style={{ height: 320 }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
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
              />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                minTickGap={20}
              />

              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                labelFormatter={(
                  _label,
                  payload
                ) => {
                  const item =
                    payload?.[0]
                      ?.payload;

                  return item?.date
                    ? `Fecha: ${item.date}`
                    : "";
                }}
                formatter={(value) => [
                  `${value}`,
                  "Movimientos",
                ]}
              />

              <Line
                type="monotone"
                dataKey="count"
                name="Movimientos"
                stroke="#2A9D8F"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="mt-6 flex h-80 items-center justify-center rounded-2xl border border-dashed border-border">
          <p className="text-sm text-secondary">
            No hay movimientos registrados en
            los últimos 30 días.
          </p>
        </div>
      )}
    </section>
  );
}