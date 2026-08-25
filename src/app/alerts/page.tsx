import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/ui/MetricCard";
import Link from "next/link";
import {
    AlertTriangle,
    CalendarClock,
    FlaskConical,
    MapPin,
    MoveRight,
} from "lucide-react";

const occupancyAlerts = [
    {
        id: "occ-a1",
        locationId: "a1",
        locationCode: "A1",
        locationName: "Estantería A - Nivel superior",
        occupancy: 92,
        message:
            "Esta ubicación está cerca de alcanzar su capacidad máxima.",
    },
    {
        id: "occ-g1",
        locationId: "g1",
        locationCode: "G1",
        locationName: "Gabinete 2 - Compartimiento superior",
        occupancy: 90,
        message:
            "La capacidad disponible es limitada. Considera reorganizar las muestras.",
    },
];

const expirationAlerts = [
    {
        id: "exp-res-001",
        sampleId: "RES-001",
        sampleCode: "RES-001",
        sampleName: "Muestra Resina A",
        expirationDate: "2026-09-02",
        daysRemaining: 14,
        message:
            "Esta muestra está próxima a completar su fecha de expiración.",
    },
    {
        id: "exp-che-220",
        sampleId: "CHE-220",
        sampleCode: "CHE-220",
        sampleName: "Solución Química C",
        expirationDate: "2026-08-28",
        daysRemaining: 9,
        message:
            "Esta muestra debe ser revisada y retirada del espacio antes de su vencimiento.",
    },
];

export default function AlertsPage() {
    const totalAlerts = occupancyAlerts.length + expirationAlerts.length;

    return (
        <AppLayout>
            <div className="space-y-8">
                {/* Header */}
                <section>
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
                        Monitoreo
                    </p>

                    <h1 className="mt-2 text-4xl font-black text-primary">
                        Alertas
                    </h1>

                    <p className="mt-2 max-w-2xl text-secondary">
                        Revisa las ubicaciones con alta ocupación y las muestras próximas a
                        su fecha de expiración.
                    </p>
                </section>

                {/* Summary */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                        title="Alertas totales"
                        value={totalAlerts.toString()}
                        subtitle="Requieren atención"
                        icon={<AlertTriangle size={20} />}
                        variant="warning"
                        compact
                    />

                    <MetricCard
                        title="Alta ocupación"
                        value={occupancyAlerts.length.toString()}
                        subtitle="Ubicaciones"
                        icon={<MapPin size={20} />}
                        variant="warning"
                        compact
                    />

                    <MetricCard
                        title="Próximas a vencer"
                        value={expirationAlerts.length.toString()}
                        subtitle="Muestras"
                        icon={<CalendarClock size={20} />}
                        variant="warning"
                        compact
                    />
                </section>

                {/* Occupancy Alerts */}
                <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-warning/15 text-warning">
                            <MapPin size={21} />
                        </div>

                        <div>
                            <h2 className="text-xl font-black text-primary">
                                Alta ocupación de espacios
                            </h2>

                            <p className="mt-1 text-sm text-secondary">
                                Ubicaciones que están cerca de alcanzar su capacidad máxima.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        {occupancyAlerts.map((alert) => (
                            <Link
                                key={alert.id}
                                href={`/locations/${alert.locationId}`}
                                className="group flex flex-col gap-4 rounded-2xl border border-border bg-white p-5 transition hover:border-warning/50 hover:shadow-sm md:flex-row md:items-center md:justify-between"
                            >
                                <div className="flex gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-warning/15 text-warning">
                                        <AlertTriangle size={20} />
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <p className="font-black text-primary">
                                                {alert.locationCode}
                                            </p>

                                            <span className="rounded-full bg-warning/15 px-3 py-1 text-xs font-extrabold text-warning">
                                                {alert.occupancy}% ocupado
                                            </span>
                                        </div>

                                        <p className="mt-1 font-bold text-primary">
                                            {alert.locationName}
                                        </p>

                                        <p className="mt-2 text-sm text-secondary">
                                            {alert.message}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Expiration Alerts */}
                <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                            <CalendarClock size={21} />
                        </div>

                        <div>
                            <h2 className="text-xl font-black text-primary">
                                Muestras próximas a vencer
                            </h2>

                            <p className="mt-1 text-sm text-secondary">
                                Muestras que deben revisarse y retirarse del almacenamiento
                                antes de su fecha de expiración.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        {expirationAlerts.map((alert) => (
                            <Link
                                key={alert.id}
                                href={`/samples/${alert.sampleId}`}
                                className="group flex flex-col gap-4 rounded-2xl border border-border bg-white p-5 transition hover:border-danger/40 hover:shadow-sm md:flex-row md:items-center md:justify-between"
                            >
                                <div className="flex gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
                                        <FlaskConical size={20} />
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <p className="font-black text-primary">
                                                {alert.sampleCode}
                                            </p>

                                            <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-extrabold text-danger">
                                                {alert.daysRemaining} días restantes
                                            </span>
                                        </div>

                                        <p className="mt-1 font-bold text-primary">
                                            {alert.sampleName}
                                        </p>

                                        <p className="mt-2 text-sm text-secondary">
                                            {alert.message}
                                        </p>

                                        <p className="mt-2 text-xs font-bold text-secondary">
                                            Fecha de expiración: {alert.expirationDate}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}