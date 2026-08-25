import { AppLayout } from "@/components/layout/AppLayout";
import { CriticalLocationsTable } from "@/components/reports/CriticalLocationsTable";
import { ExpirationChart } from "@/components/reports/ExpirationChart";
import { InventoryFlowChart } from "@/components/reports/InventoryFlowChart";
import { MovementTrendChart } from "@/components/reports/MovementTrendChart";
import { OccupancyChart } from "@/components/reports/OccupancyChart";
import { SampleTypesChart } from "@/components/reports/SampleTypesChart";
import { MetricCard } from "@/components/ui/MetricCard";
import {
    AlertTriangle,
    Boxes,
    FlaskConical,
    History,
} from "lucide-react";

export default function ReportsPage() {
    return (
        <AppLayout>
            <div className="space-y-8">
                {/* Header */}
                <section>
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
                        Analítica
                    </p>

                    <h1 className="mt-2 text-4xl font-black text-primary">
                        Reportes
                    </h1>

                    <p className="mt-2 max-w-3xl text-secondary">
                        Analiza la ocupación del laboratorio, la distribución del
                        inventario, los movimientos de muestras y los próximos
                        vencimientos.
                    </p>
                </section>

                {/* Summary metrics */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                        title="Ocupación general"
                        value="70%"
                        subtitle="Capacidad utilizada"
                        icon={<Boxes size={20} />}
                        compact
                    />

                    <MetricCard
                        title="Muestras activas"
                        value="248"
                        subtitle="En inventario"
                        icon={<FlaskConical size={20} />}
                        compact
                    />

                    <MetricCard
                        title="Movimientos"
                        value="118"
                        subtitle="Últimos 30 días"
                        icon={<History size={20} />}
                        compact
                    />

                    <MetricCard
                        title="Alertas críticas"
                        value="5"
                        subtitle="Requieren atención"
                        icon={<AlertTriangle size={20} />}
                        variant="warning"
                        compact
                    />
                </section>

                {/* Occupancy + sample types */}
                <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                    <div className="min-w-0">
                        <OccupancyChart />
                    </div>

                    <div className="min-w-0">
                        <SampleTypesChart />
                    </div>
                </section>

                {/* Movement analytics */}
                <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="min-w-0">
                        <MovementTrendChart />
                    </div>

                    <div className="min-w-0">
                        <InventoryFlowChart />
                    </div>
                </section>

                {/* Expirations */}
                <section className="min-w-0">
                    <ExpirationChart />
                </section>

                {/* Critical locations */}
                <section>
                    <CriticalLocationsTable />
                </section>
            </div>
        </AppLayout>
    );
}