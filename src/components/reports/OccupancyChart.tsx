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
        location: "A1",
        name: "Estantería A - Nivel superior",
        occupancy: 92,
    },
    {
        location: "G1",
        name: "Gabinete 2 - Compartimiento superior",
        occupancy: 90,
    },
    {
        location: "F1",
        name: "Nevera 1 - Bandeja superior",
        occupancy: 80,
    },
    {
        location: "A2",
        name: "Estantería A - Nivel medio",
        occupancy: 60,
    },
    {
        location: "F2",
        name: "Nevera 1 - Bandeja inferior",
        occupancy: 60,
    },
    {
        location: "A3",
        name: "Estantería A - Nivel inferior",
        occupancy: 40,
    },
];

export function OccupancyChart() {
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
                    Compara el porcentaje de capacidad utilizada en cada ubicación del
                    laboratorio.
                </p>
            </div>

            <div
                className="mt-6 w-full"
                style={{ height: 320 }}
            >
                <ResponsiveContainer width="100%" height="100%">
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
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />

                        <XAxis
                            type="number"
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}%`}
                        />

                        <YAxis
                            dataKey="location"
                            type="category"
                            width={45}
                        />

                        <Tooltip
                            formatter={(value) => [`${value}%`, "Ocupación"]}
                            labelFormatter={(label) => {
                                const item = data.find(
                                    (location) => location.location === label
                                );

                                return item
                                    ? `${item.location} · ${item.name}`
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