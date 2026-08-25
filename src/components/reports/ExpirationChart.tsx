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

const data = [
  {
    period: "7 días",
    samples: 3,
  },
  {
    period: "30 días",
    samples: 8,
  },
  {
    period: "90 días",
    samples: 17,
  },
];

export function ExpirationChart() {
  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Vencimientos
        </p>

        <h2 className="mt-2 text-xl font-black text-primary">
          Próximas expiraciones
        </h2>

        <p className="mt-2 text-sm text-secondary">
          Visualiza cuántas muestras alcanzarán su fecha de expiración en los
          próximos períodos.
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
                "Próximas a vencer",
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

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ExpirationSummary
          label="Próximos 7 días"
          value="3"
          level="critical"
        />

        <ExpirationSummary
          label="Próximos 30 días"
          value="8"
          level="warning"
        />

        <ExpirationSummary
          label="Próximos 90 días"
          value="17"
          level="default"
        />
      </div>
    </section>
  );
}

function ExpirationSummary({
  label,
  value,
  level,
}: {
  label: string;
  value: string;
  level: "critical" | "warning" | "default";
}) {
  const styles = {
    critical: "bg-danger/10 text-danger",
    warning: "bg-warning/15 text-warning",
    default: "bg-accent/10 text-accent",
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