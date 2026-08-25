import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/ui/MetricCard";
import { LocationOverviewCard } from "@/components/locations/LocationOverviewCard";
import Link from "next/link";
import {
    Box,
    CheckCircle2,
    FlaskConical,
    MapPin,
    Plus,
    Search,
    Snowflake,
    Warehouse,
} from "lucide-react";

const locations = [
    {
        id: "a1",
        code: "A1",
        name: "Estantería A - Nivel superior",
        type: "Estantería",
        description:
            "Ubicación destinada a muestras sólidas y materiales estables a temperatura ambiente.",
        allowedTypes: ["Resina", "Polímero"],
        sampleCount: 8,
        capacity: 10,
        occupancy: 80,
    },
    {
        id: "a2",
        code: "A2",
        name: "Estantería A - Nivel medio",
        type: "Estantería",
        description:
            "Ubicación para muestras sólidas con requerimientos estándar de almacenamiento.",
        allowedTypes: ["Resina", "Polímero"],
        sampleCount: 6,
        capacity: 10,
        occupancy: 60,
    },
    {
        id: "a3",
        code: "A3",
        name: "Estantería A - Nivel inferior",
        type: "Estantería",
        description:
            "Espacio de almacenamiento general con mayor disponibilidad actual.",
        allowedTypes: ["Resina"],
        sampleCount: 4,
        capacity: 10,
        occupancy: 40,
    },
    {
        id: "f1",
        code: "F1",
        name: "Nevera 1 - Bandeja superior",
        type: "Refrigerado",
        description:
            "Ubicación refrigerada para muestras que requieren conservación a baja temperatura.",
        allowedTypes: ["Reactivo", "Resina especial"],
        sampleCount: 8,
        capacity: 10,
        occupancy: 80,
    },
    {
        id: "f2",
        code: "F2",
        name: "Nevera 1 - Bandeja inferior",
        type: "Refrigerado",
        description:
            "Ubicación refrigerada destinada a materiales sensibles a temperatura.",
        allowedTypes: ["Reactivo"],
        sampleCount: 6,
        capacity: 10,
        occupancy: 60,
    },
    {
        id: "g1",
        code: "G1",
        name: "Gabinete 2 - Compartimiento superior",
        type: "Gabinete",
        description:
            "Ubicación cerrada para materiales que deben mantenerse protegidos de exposición directa.",
        allowedTypes: ["Sustancia química", "Reactivo"],
        sampleCount: 9,
        capacity: 10,
        occupancy: 90,
    },
    {
        id: "g2",
        code: "G2",
        name: "Gabinete 2 - Compartimiento inferior",
        type: "Gabinete",
        description:
            "Espacio cerrado para almacenamiento de materiales químicos compatibles.",
        allowedTypes: ["Sustancia química"],
        sampleCount: 8,
        capacity: 10,
        occupancy: 80,
    },
];

export default function LocationsPage() {
    const totalLocations = locations.length;

    const totalSamples = locations.reduce(
        (total, location) => total + location.sampleCount,
        0
    );

    const totalCapacity = locations.reduce(
        (total, location) => total + location.capacity,
        0
    );

    const availableSpaces = totalCapacity - totalSamples;

    const generalOccupancy = Math.round(
        (totalSamples / totalCapacity) * 100
    );

    return (
        <AppLayout>
            <div className="space-y-8">
                {/* Header */}
                <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
                            Almacenamiento
                        </p>

                        <h1 className="mt-2 text-4xl font-black text-primary">
                            Ubicaciones
                        </h1>

                        <p className="mt-2 max-w-2xl text-secondary">
                            Consulta los espacios disponibles del laboratorio, su ocupación,
                            las muestras almacenadas y los tipos de material permitidos.
                        </p>
                    </div>

                    <Link
                        href="/locations/new"
                        className="flex items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-accent/20 transition hover:opacity-90"
                    >
                        <Plus size={18} />
                        Nueva ubicación
                    </Link>
                </section>

                {/* Summary metrics */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:max-w-6xl">
                    <MetricCard
                        title="Ubicaciones"
                        value={totalLocations.toString()}
                        subtitle="Registradas"
                        icon={<MapPin size={20} />}
                        compact
                    />

                    <MetricCard
                        title="Muestras almacenadas"
                        value={totalSamples.toString()}
                        subtitle="En todas las ubicaciones"
                        icon={<FlaskConical size={20} />}
                        compact
                    />

                    <MetricCard
                        title="Espacios disponibles"
                        value={availableSpaces.toString()}
                        subtitle={`De ${totalCapacity} espacios`}
                        icon={<CheckCircle2 size={20} />}
                        compact
                    />

                    <MetricCard
                        title="Ocupación general"
                        value={`${generalOccupancy}%`}
                        subtitle="Capacidad utilizada"
                        icon={<Box size={20} />}
                        compact
                    />
                </section>

                {/* Search */}
                <section className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
                    <div className="flex max-w-lg items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3">
                        <Search size={18} className="text-accent" />

                        <input
                            type="text"
                            placeholder="Buscar por código, nombre, tipo o muestra permitida..."
                            className="w-full bg-transparent text-sm outline-none placeholder:text-secondary/50"
                        />
                    </div>
                </section>

                {/* Locations grid */}
                <section>
                    <div className="mb-5">
                        <h2 className="text-xl font-black text-primary">
                            Espacios de almacenamiento
                        </h2>

                        <p className="mt-1 text-sm text-secondary">
                            Cada tarjeta representa una ubicación independiente dentro del
                            laboratorio.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {locations.map((location) => (
                            <LocationOverviewCard
                                key={location.id}
                                location={location}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
