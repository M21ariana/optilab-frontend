"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type {
  ReportSamplesByMaterialType,
} from "@/lib/graphql/reports";

// ----------------------------------------
// TYPES
// ----------------------------------------

type SampleTypesChartProps = {
  data: ReportSamplesByMaterialType[];
};

// ----------------------------------------
// COLORS
// ----------------------------------------

const COLORS = [
  "#2A9D8F",
  "#457B9D",
  "#E76F51",
  "#1D3557",
  "#E9C46A",
  "#6D597A",
  "#84A59D",
  "#F28482",
];

// ----------------------------------------
// COMPONENT
// ----------------------------------------

export function SampleTypesChart({
  data,
}: SampleTypesChartProps) {
  const chartData = data.map(
    (item, index) => ({
      name: item.name,
      value: item.count,
      color:
        COLORS[index % COLORS.length],
    })
  );

  const totalSamples =
    chartData.reduce(
      (total, item) =>
        total + item.value,
      0
    );

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Inventario
        </p>

        <h2 className="mt-2 text-xl font-black text-primary">
          Distribución por tipo de muestra
        </h2>

        <p className="mt-2 text-sm text-secondary">
          Visualiza qué tipos de muestra
          representan una mayor proporción del
          inventario actual.
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
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={110}
                paddingAngle={3}
              >
                {chartData.map(
                  (entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                    />
                  )
                )}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  `${value} muestras`,
                  "Cantidad",
                ]}
              />

              <Legend
                verticalAlign="bottom"
                height={36}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="mt-6 flex h-80 items-center justify-center rounded-2xl border border-dashed border-border">
          <p className="text-sm text-secondary">
            No hay muestras activas para
            mostrar.
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-background px-4 py-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-secondary">
            Total representado
          </p>

          <p className="mt-1 text-2xl font-black text-primary">
            {totalSamples}
          </p>
        </div>

        <p className="text-sm text-secondary">
          Muestras activas
        </p>
      </div>
    </section>
  );
}