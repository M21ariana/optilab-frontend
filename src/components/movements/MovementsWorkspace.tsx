"use client";

import {
    useMemo,
    useState,
} from "react";

import Link from "next/link";

import {
    ArrowDownToLine,
    ArrowRight,
    ArrowUpFromLine,
    CalendarDays,
    FlaskConical,
    History,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";

import { MetricCard } from "@/components/ui/MetricCard";

import {
    MovementTypeBadge,
} from "@/components/movements/MovementTypeBadge";

import type {
    SampleMovementRecord,
    SampleMovementType,
} from "@/lib/graphql/movements";

// ======================================================
// TYPES
// ======================================================

type MovementsWorkspaceProps = {
    movements: SampleMovementRecord[];
};

type MovementTypeFilter =
    | "ALL"
    | SampleMovementType;

// ======================================================
// DATE FORMATTERS
// ======================================================

function formatMovementDate(
    value: string
) {
    const date = new Date(value);

    return new Intl.DateTimeFormat(
        "es-CO",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }
    ).format(date);
}

function formatMovementTime(
    value: string
) {
    const date = new Date(value);

    return new Intl.DateTimeFormat(
        "es-CO",
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }
    ).format(date);
}

// ======================================================
// COMPONENT
// ======================================================

export function MovementsWorkspace({
    movements,
}: MovementsWorkspaceProps) {
    // ----------------------------------------
    // FILTER STATE
    // ----------------------------------------

    const [search, setSearch] =
        useState("");

    const [
        movementType,
        setMovementType,
    ] =
        useState<MovementTypeFilter>(
            "ALL"
        );

    const [dateFrom, setDateFrom] =
        useState("");

    const [dateTo, setDateTo] =
        useState("");

    const [
        showFilters,
        setShowFilters,
    ] =
        useState(false);

    // ----------------------------------------
    // METRICS
    // ----------------------------------------

    const totalMovements =
        movements.length;

    const entries =
        movements.filter(
            (movement) =>
                movement.movementType ===
                "ENTRY"
        ).length;

    const transfers =
        movements.filter(
            (movement) =>
                movement.movementType ===
                "TRANSFER"
        ).length;

    const exits =
        movements.filter(
            (movement) =>
                movement.movementType ===
                "EXIT"
        ).length;

    // ----------------------------------------
    // ACTIVE FILTERS
    // ----------------------------------------

    const hasActiveFilters =
        search.trim() !== "" ||
        movementType !== "ALL" ||
        dateFrom !== "" ||
        dateTo !== "";

    // ----------------------------------------
    // FILTERED MOVEMENTS
    // ----------------------------------------

    const filteredMovements =
        useMemo(() => {
            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase();

            return movements.filter(
                (movement) => {
                    // --------------------------------
                    // SEARCH
                    // --------------------------------

                    const matchesSearch =
                        !normalizedSearch ||
                        movement.sample.name
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        movement.sample.code
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        movement.fromLocation?.name
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        movement.fromLocation?.code
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        movement.toLocation?.name
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        movement.toLocation?.code
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        movement.performedBy
                            ?.fullName
                            ?.toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        movement.notes
                            ?.toLowerCase()
                            .includes(
                                normalizedSearch
                            );

                    if (!matchesSearch) {
                        return false;
                    }

                    // --------------------------------
                    // TYPE
                    // --------------------------------

                    if (
                        movementType !== "ALL" &&
                        movement.movementType !==
                        movementType
                    ) {
                        return false;
                    }

                    // --------------------------------
                    // DATE
                    // --------------------------------

                    const movementDate =
                        new Date(
                            movement.createdAt
                        );

                    if (dateFrom) {
                        const from =
                            new Date(
                                `${dateFrom}T00:00:00`
                            );

                        if (
                            movementDate < from
                        ) {
                            return false;
                        }
                    }

                    if (dateTo) {
                        const to =
                            new Date(
                                `${dateTo}T23:59:59.999`
                            );

                        if (
                            movementDate > to
                        ) {
                            return false;
                        }
                    }

                    return true;
                }
            );
        }, [
            movements,
            search,
            movementType,
            dateFrom,
            dateTo,
        ]);

    // ----------------------------------------
    // CLEAR FILTERS
    // ----------------------------------------

    function clearFilters() {
        setSearch("");
        setMovementType("ALL");
        setDateFrom("");
        setDateTo("");
    }

    // ----------------------------------------
    // RENDER
    // ----------------------------------------

    return (
        <div className="space-y-8">
            {/* ==================================== */}
            {/* HEADER */}
            {/* ==================================== */}

            <section>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
                    Trazabilidad
                </p>

                <h1 className="mt-2 text-4xl font-black text-primary">
                    Movimientos
                </h1>

                <p className="mt-2 max-w-2xl text-secondary">
                    Consulta el historial de
                    entradas, traslados y salidas de
                    las muestras registradas en el
                    laboratorio.
                </p>
            </section>

            {/* ==================================== */}
            {/* METRICS */}
            {/* ==================================== */}

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    title="Movimientos"
                    value={totalMovements.toString()}
                    subtitle="Registrados"
                    icon={
                        <History size={20} />
                    }
                    compact
                />

                <MetricCard
                    title="Entradas"
                    value={entries.toString()}
                    subtitle="Muestras ingresadas"
                    icon={
                        <ArrowDownToLine
                            size={20}
                        />
                    }
                    compact
                />

                <MetricCard
                    title="Traslados"
                    value={transfers.toString()}
                    subtitle="Cambios de ubicación"
                    icon={
                        <ArrowRight size={20} />
                    }
                    compact
                />

                <MetricCard
                    title="Salidas"
                    value={exits.toString()}
                    subtitle="Muestras retiradas"
                    icon={
                        <ArrowUpFromLine
                            size={20}
                        />
                    }
                    compact
                />
            </section>

            {/* ==================================== */}
            {/* SEARCH + FILTERS */}
            {/* ==================================== */}

            <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
                <div className="space-y-4">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
                        {/* SEARCH */}

                        <div className="flex-1">
                            <label
                                htmlFor="movement-search"
                                className="mb-2 block text-xs font-bold uppercase tracking-wider text-secondary"
                            >
                                Buscar
                            </label>

                            <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3">
                                <Search
                                    size={18}
                                    className="shrink-0 text-accent"
                                />

                                <input
                                    id="movement-search"
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Nombre, código, ubicación..."
                                    className="w-full bg-transparent text-sm text-primary outline-none placeholder:text-secondary/50"
                                />
                            </div>
                        </div>

                        {/* MOVEMENT TYPE */}

                        <div className="xl:w-48">
                            <label
                                htmlFor="movement-type"
                                className="mb-2 block text-xs font-bold uppercase tracking-wider text-secondary"
                            >
                                Movimiento
                            </label>

                            <select
                                id="movement-type"
                                value={movementType}
                                onChange={(event) =>
                                    setMovementType(
                                        event.target
                                            .value as MovementTypeFilter
                                    )
                                }
                                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm font-bold text-primary outline-none transition focus:border-accent"
                            >
                                <option value="ALL">
                                    Todos
                                </option>

                                <option value="ENTRY">
                                    Entradas
                                </option>

                                <option value="TRANSFER">
                                    Traslados
                                </option>

                                <option value="EXIT">
                                    Salidas
                                </option>
                            </select>
                        </div>

                        {/* DATE FROM */}

                        <div className="xl:w-48">
                            <label
                                htmlFor="movement-date-from"
                                className="mb-2 block text-xs font-bold uppercase tracking-wider text-secondary"
                            >
                                Desde
                            </label>

                            <input
                                id="movement-date-from"
                                type="date"
                                value={dateFrom}
                                onChange={(event) =>
                                    setDateFrom(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm font-bold text-primary outline-none transition focus:border-accent"
                            />
                        </div>

                        {/* DATE TO */}

                        <div className="xl:w-48">
                            <label
                                htmlFor="movement-date-to"
                                className="mb-2 block text-xs font-bold uppercase tracking-wider text-secondary"
                            >
                                Hasta
                            </label>

                            <input
                                id="movement-date-to"
                                type="date"
                                value={dateTo}
                                onChange={(event) =>
                                    setDateTo(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm font-bold text-primary outline-none transition focus:border-accent"
                            />
                        </div>
                    </div>

                    {/* ACTIVE FILTERS */}

                    {hasActiveFilters && (
                        <div className="flex items-center justify-between border-t border-border pt-4">
                            <p className="text-xs text-secondary">
                                Mostrando{" "}
                                <span className="font-bold text-primary">
                                    {filteredMovements.length}
                                </span>{" "}
                                de{" "}
                                <span className="font-bold text-primary">
                                    {movements.length}
                                </span>{" "}
                                movimientos
                            </p>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="flex items-center gap-2 text-sm font-bold text-secondary transition hover:text-accent"
                            >
                                <X size={16} />
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ==================================== */}
            {/* HISTORY */}
            {/* ==================================== */}

            <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-xl font-black text-primary">
                            Historial de movimientos
                        </h2>

                        <p className="mt-1 text-sm text-secondary">
                            Registro cronológico de
                            entradas, traslados y salidas
                            de muestras.
                        </p>
                    </div>

                    {hasActiveFilters && (
                        <p className="text-sm font-semibold text-secondary">
                            {
                                filteredMovements.length
                            }{" "}
                            de {movements.length}{" "}
                            movimientos
                        </p>
                    )}
                </div>

                {/* ================================== */}
                {/* EMPTY ORGANIZATION */}
                {/* ================================== */}

                {movements.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                            <History size={22} />
                        </div>

                        <h3 className="mt-4 font-black text-primary">
                            No hay movimientos
                            registrados
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm text-secondary">
                            Los movimientos aparecerán
                            aquí cuando se registren
                            entradas, traslados o salidas
                            de muestras.
                        </p>
                    </div>
                ) : filteredMovements.length ===
                    0 ? (
                    /* ================================ */
                    /* NO FILTER RESULTS */
                    /* ================================ */

                    <div className="mt-6 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
                        <Search
                            size={22}
                            className="mx-auto text-accent"
                        />

                        <h3 className="mt-4 font-black text-primary">
                            No encontramos movimientos
                        </h3>

                        <p className="mt-2 text-sm text-secondary">
                            Prueba modificando la
                            búsqueda o los filtros
                            seleccionados.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-4 text-sm font-bold text-accent transition hover:opacity-80"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                ) : (
                    /* ================================ */
                    /* TABLE */
                    /* ================================ */

                    <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
                        <table className="w-full min-w-[1100px] border-collapse bg-white text-left text-sm">
                            <thead className="bg-muted text-xs uppercase tracking-wider text-secondary">
                                <tr>
                                    <th className="px-5 py-4">
                                        Fecha
                                    </th>

                                    <th className="px-5 py-4">
                                        Muestra
                                    </th>

                                    <th className="px-5 py-4">
                                        Movimiento
                                    </th>

                                    <th className="px-5 py-4">
                                        Origen
                                    </th>

                                    <th className="px-5 py-4">
                                        Destino
                                    </th>

                                    <th className="px-5 py-4">
                                        Motivo / notas
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-border">
                                {filteredMovements.map(
                                    (movement) => (
                                        <tr
                                            key={
                                                movement.id
                                            }
                                            className="transition hover:bg-background/60"
                                        >
                                            {/* DATE */}

                                            <td className="whitespace-nowrap px-5 py-4">
                                                <p className="font-bold text-primary">
                                                    {formatMovementDate(
                                                        movement.createdAt
                                                    )}
                                                </p>

                                                <p className="mt-1 text-xs text-secondary">
                                                    {formatMovementTime(
                                                        movement.createdAt
                                                    )}
                                                </p>
                                            </td>

                                            {/* SAMPLE */}

                                            <td className="px-5 py-4">
                                                <Link
                                                    href={`/samples/${movement.sample.id}`}
                                                    className="group flex items-center gap-3"
                                                >
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                                                        <FlaskConical
                                                            size={
                                                                18
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="font-bold text-primary transition group-hover:text-accent">
                                                            {
                                                                movement
                                                                    .sample
                                                                    .name
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-secondary">
                                                            {
                                                                movement
                                                                    .sample
                                                                    .code
                                                            }
                                                        </p>
                                                    </div>
                                                </Link>
                                            </td>

                                            {/* TYPE */}

                                            <td className="px-5 py-4">
                                                <MovementTypeBadge
                                                    type={
                                                        movement.movementType
                                                    }
                                                />
                                            </td>

                                            {/* FROM */}

                                            <td className="px-5 py-4">
                                                {movement.fromLocation ? (
                                                    <Link
                                                        href={`/locations/${movement.fromLocation.id}`}
                                                        className="font-bold text-primary transition hover:text-accent"
                                                    >
                                                        {
                                                            movement
                                                                .fromLocation
                                                                .code
                                                        }

                                                        <span className="mt-1 block max-w-[190px] text-xs font-normal text-secondary">
                                                            {
                                                                movement
                                                                    .fromLocation
                                                                    .name
                                                            }
                                                        </span>
                                                    </Link>
                                                ) : (
                                                    <span className="text-secondary">
                                                        Fuera del
                                                        inventario
                                                    </span>
                                                )}
                                            </td>

                                            {/* TO */}

                                            <td className="px-5 py-4">
                                                {movement.toLocation ? (
                                                    <Link
                                                        href={`/locations/${movement.toLocation.id}`}
                                                        className="font-bold text-primary transition hover:text-accent"
                                                    >
                                                        {
                                                            movement
                                                                .toLocation
                                                                .code
                                                        }

                                                        <span className="mt-1 block max-w-[190px] text-xs font-normal text-secondary">
                                                            {
                                                                movement
                                                                    .toLocation
                                                                    .name
                                                            }
                                                        </span>
                                                    </Link>
                                                ) : (
                                                    <span className="text-secondary">
                                                        Fuera del
                                                        inventario
                                                    </span>
                                                )}
                                            </td>

                                            {/* NOTES */}

                                            <td className="max-w-[320px] px-5 py-4">
                                                <p className="leading-6 text-secondary">
                                                    {movement.notes ||
                                                        "Sin observaciones"}
                                                </p>

                                                {movement
                                                    .performedBy
                                                    ?.fullName && (
                                                        <p className="mt-2 text-xs text-secondary/70">
                                                            Por{" "}
                                                            {
                                                                movement
                                                                    .performedBy
                                                                    .fullName
                                                            }
                                                        </p>
                                                    )}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}