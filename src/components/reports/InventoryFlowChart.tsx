"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    month: "Mar",
    entries: 18,
    exits: 6,
  },
  {
    month: "Abr",
    entries: 22,
    exits: 8,
  },
  {
    month: "May",
    entries: 19,
    exits: 10,
  },
  {
    month: "Jun",
    entries: 27,
    exits: 12,
  },
  {
    month: "Jul",
    entries: 31,
    exits: 15,
  },
  {
    month: "Ago",
    entries: 26,
    exits: 18,
  },
];

export function InventoryFlowChart() {
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
          Compara cuántas muestras ingresan y salen del inventario en cada
          período.
        </p>
      </div>

      <div
        className="mt-6 w-full"
        style={{ height: 320 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
              dataKey="month"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="entries"
              name="Entradas"
              fill="#2A9D8F"
              radius={[8, 8, 0, 0]}
            />

            <Bar
              dataKey="exits"
              name="Salidas"
              fill="#E76F51"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}