import { AppLayout } from "@/components/layout/AppLayout";
import type { Movement } from "@/components/movements/types";
import { MetricCard } from "@/components/ui/MetricCard";
import { MovementTypeBadge } from "@/components/movements/MovementTypeBadge";
import Link from "next/link";
import { FlaskConical } from "lucide-react";
import {
    ArrowDownToLine,
    ArrowRight,
    ArrowUpFromLine,
    History,
    Search,
    SlidersHorizontal,
} from "lucide-react";

const movements: Movement[] = [
    {
        id: 1,
        sampleId: "RES-001",
        sampleCode: "RES-001",
        sampleName: "Muestra Resina A",
        type: "TRANSFER",
        typeLabel: "Traslado",
        fromLocation: "A1",
        fromLocationName: "Estantería A - Nivel superior",
        toLocation: "A2",
        toLocationName: "Estantería A - Nivel medio",
        notes:
            "Reubicación para mejorar la distribución del espacio disponible.",
        date: "18/08/2026",
        time: "10:42",
    },
    {
        id: 2,
        sampleId: "POL-014",
        sampleCode: "POL-014",
        sampleName: "Polímero Experimental B",
        type: "ENTRY",
        typeLabel: "Entrada",
        fromLocation: null,
        fromLocationName: null,
        toLocation: "F2",
        toLocationName: "Nevera 1 - Bandeja inferior",
        notes: "Ingreso inicial de la muestra al inventario.",
        date: "17/08/2026",
        time: "14:18",
    },
    {
        id: 3,
        sampleId: "CHE-220",
        sampleCode: "CHE-220",
        sampleName: "Solución Química C",
        type: "EXIT",
        typeLabel: "Salida",
        fromLocation: "G1",
        fromLocationName: "Gabinete 2 - Compartimiento superior",
        toLocation: null,
        toLocationName: null,
        notes: "Muestra retirada por finalización de su vida útil.",
        date: "16/08/2026",
        time: "09:05",
    },
    {
        id: 4,
        sampleId: "RES-033",
        sampleCode: "RES-033",
        sampleName: "Resina UV",
        type: "TRANSFER",
        typeLabel: "Traslado",
        fromLocation: "A3",
        fromLocationName: "Estantería A - Nivel inferior",
        toLocation: "A1",
        toLocationName: "Estantería A - Nivel superior",
        notes: "Cambio de ubicación por reorganización del laboratorio.",
        date: "15/08/2026",
        time: "16:30",
    },
];

export default function MovementsPage() {
    const totalMovements = movements.length;

    const entries = movements.filter(
        (movement) => movement.type === "ENTRY"
    ).length;

    const transfers = movements.filter(
        (movement) => movement.type === "TRANSFER"
    ).length;

    const exits = movements.filter(
        (movement) => movement.type === "EXIT"
    ).length;

    return (
        <AppLayout>
            <div className="space-y-8">
                {/* Header */}
                <section>
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
                        Trazabilidad
                    </p>

                    <h1 className="mt-2 text-4xl font-black text-primary">
                        Movimientos
                    </h1>

                    <p className="mt-2 max-w-2xl text-secondary">
                        Consulta el historial de entradas, traslados y salidas de las
                        muestras registradas en el laboratorio.
                    </p>
                </section>

                {/* Métricas */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

                    <MetricCard
                        title="Movimientos"
                        value={totalMovements.toString()}
                        subtitle="Registrados"
                        icon={<History size={20} />}
                        compact
                    />

                    <MetricCard
                        title="Entradas"
                        value={entries.toString()}
                        subtitle="Muestras ingresadas"
                        icon={<ArrowDownToLine size={20} />}
                        compact
                    />

                    <MetricCard
                        title="Traslados"
                        value={transfers.toString()}
                        subtitle="Cambios de ubicación"
                        icon={<ArrowRight size={20} />}
                        compact
                    />

                    <MetricCard
                        title="Salidas"
                        value={exits.toString()}
                        subtitle="Muestras retiradas"
                        icon={<ArrowUpFromLine size={20} />}
                        compact
                    />
                </section>

                {/* Búsqueda y filtros */}
                <section className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex w-full max-w-lg items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3">
                            <Search size={18} className="text-accent" />

                            <input
                                type="text"
                                placeholder="Buscar por muestra, código o ubicación..."
                                className="w-full bg-transparent text-sm outline-none placeholder:text-secondary/50"
                            />
                        </div>

                        <button
                            type="button"
                            className="flex w-fit items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-bold text-primary transition hover:border-accent"
                        >
                            <SlidersHorizontal size={18} />
                            Filtrar movimientos
                        </button>
                    </div>
                </section>

                {/* Historial */}
                <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
                    <div>
                        <h2 className="text-xl font-black text-primary">
                            Historial de movimientos
                        </h2>

                        <p className="mt-1 text-sm text-secondary">
                            Registro cronológico de entradas, traslados y salidas de muestras.
                        </p>
                    </div>

                    <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
                        <table className="w-full min-w-[1100px] border-collapse bg-white text-left text-sm">
                            <thead className="bg-muted text-xs uppercase tracking-wider text-secondary">
                                <tr>
                                    <th className="px-5 py-4">Fecha</th>
                                    <th className="px-5 py-4">Muestra</th>
                                    <th className="px-5 py-4">Movimiento</th>
                                    <th className="px-5 py-4">Origen</th>
                                    <th className="px-5 py-4">Destino</th>
                                    <th className="px-5 py-4">Motivo / notas</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-border">
                                {movements.map((movement) => (
                                    <tr
                                        key={movement.id}
                                        className="transition hover:bg-background/60"
                                    >
                                        {/* Fecha */}
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <p className="font-bold text-primary">
                                                {movement.date}
                                            </p>

                                            <p className="mt-1 text-xs text-secondary">
                                                {movement.time}
                                            </p>
                                        </td>

                                        {/* Muestra */}
                                        <td className="px-5 py-4">
                                            <Link
                                                href={`/samples/${movement.sampleId}`}
                                                className="group flex items-center gap-3"
                                            >
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                                                    <FlaskConical size={18} />
                                                </div>

                                                <div>
                                                    <p className="font-bold text-primary transition group-hover:text-accent">
                                                        {movement.sampleName}
                                                    </p>

                                                    <p className="mt-1 text-xs text-secondary">
                                                        {movement.sampleCode}
                                                    </p>
                                                </div>
                                            </Link>
                                        </td>

                                        {/* Tipo */}
                                        <td className="px-5 py-4">
                                            <MovementTypeBadge type={movement.type} />
                                        </td>

                                        {/* Origen */}
                                        <td className="px-5 py-4">
                                            {movement.fromLocation ? (
                                                <Link
                                                    href={`/locations/${movement.fromLocation.toLowerCase()}`}
                                                    className="font-bold text-primary transition hover:text-accent"
                                                >
                                                    {movement.fromLocation}
                                                    <span className="mt-1 block max-w-[190px] text-xs font-normal text-secondary">
                                                        {movement.fromLocationName}
                                                    </span>
                                                </Link>
                                            ) : (
                                                <span className="text-secondary">
                                                    Fuera del inventario
                                                </span>
                                            )}
                                        </td>

                                        {/* Destino */}
                                        <td className="px-5 py-4">
                                            {movement.toLocation ? (
                                                <Link
                                                    href={`/locations/${movement.toLocation.toLowerCase()}`}
                                                    className="font-bold text-primary transition hover:text-accent"
                                                >
                                                    {movement.toLocation}
                                                    <span className="mt-1 block max-w-[190px] text-xs font-normal text-secondary">
                                                        {movement.toLocationName}
                                                    </span>
                                                </Link>
                                            ) : (
                                                <span className="text-secondary">
                                                    Fuera del inventario
                                                </span>
                                            )}
                                        </td>

                                        {/* Notas */}
                                        <td className="max-w-[320px] px-5 py-4">
                                            <p className="leading-6 text-secondary">
                                                {movement.notes || "Sin observaciones"}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}