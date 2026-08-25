"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    month: "Mar",
    entries: 18,
    transfers: 12,
    exits: 6,
  },
  {
    month: "Abr",
    entries: 22,
    transfers: 16,
    exits: 8,
  },
  {
    month: "May",
    entries: 19,
    transfers: 21,
    exits: 10,
  },
  {
    month: "Jun",
    entries: 27,
    transfers: 24,
    exits: 12,
  },
  {
    month: "Jul",
    entries: 31,
    transfers: 29,
    exits: 15,
  },
  {
    month: "Ago",
    entries: 26,
    transfers: 34,
    exits: 18,
  },
];

export function MovementTrendChart() {
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
          Compara la evolución de entradas, traslados y salidas de muestras en
          el laboratorio.
        </p>
      </div>

      <div
        className="mt-6 w-full"
        style={{ height: 320 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

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

            <Line
              type="monotone"
              dataKey="entries"
              name="Entradas"
              stroke="#2A9D8F"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              type="monotone"
              dataKey="transfers"
              name="Traslados"
              stroke="#457B9D"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              type="monotone"
              dataKey="exits"
              name="Salidas"
              stroke="#E76F51"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}