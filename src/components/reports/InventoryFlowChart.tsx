"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  ReportInventoryFlow,
} from "@/lib/graphql/reports";

// ----------------------------------------
// TYPES
// ----------------------------------------

type InventoryFlowChartProps = {
  data: ReportInventoryFlow[];
};

// ----------------------------------------
// COMPONENT
// ----------------------------------------

export function InventoryFlowChart({
  data,
}: InventoryFlowChartProps) {
  // ----------------------------------------
  // PREPARE DATA
  // ----------------------------------------

  const entries =
    data.find(
      (item) =>
        item.movementType === "ENTRY"
    )?.count ?? 0;

  const exits =
    data.find(
      (item) =>
        item.movementType === "EXIT"
    )?.count ?? 0;

  const chartData = [
    {
      type: "Entradas",
      count: entries,
      fill: "#2A9D8F",
    },
    {
      type: "Salidas",
      count: exits,
      fill: "#E76F51",
    },
  ];

  const hasData =
    entries > 0 || exits > 0;

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Inventario
        </p>

        <h2 className="mt-2 text-xl font-black text-primary">
          Entradas vs. salidas
        </h2>

        <p className="mt-2 text-sm text-secondary">
          Compara las entradas y salidas de
          muestras registradas durante los
          últimos 30 días.
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
                dataKey="type"
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
                  value,
                  "Movimientos",
                ]}
              />

              <Bar
                dataKey="count"
                name="Movimientos"
                radius={[8, 8, 0, 0]}
              >
                {chartData.map((item) => (
                  <Cell
                    key={item.type}
                    fill={item.fill}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="mt-6 flex h-80 items-center justify-center rounded-2xl border border-dashed border-border">
          <p className="text-sm text-secondary">
            No hay entradas o salidas
            registradas en los últimos 30 días.
          </p>
        </div>
      )}
    </section>
  );
}