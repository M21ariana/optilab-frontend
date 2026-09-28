import Link from "next/link";
import {
    Box,
    CheckCircle2,
    FlaskConical,
    MapPin,
    Plus,
    Search,
} from "lucide-react";

import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/ui/MetricCard";
import { LocationOverviewCard } from "@/components/locations/LocationOverviewCard";

import { auth0 } from "@/lib/auth0";
import { graphqlRequest } from "@/lib/graphql/client";

import {
    STORAGE_LOCATIONS_QUERY,
    type StorageLocationsResponse,
} from "@/lib/graphql/locations";

type LocationsPageProps = {
    searchParams: Promise<{
        search?: string;
    }>;
};

export default async function LocationsPage({
    searchParams,
}: LocationsPageProps) {
    // ----------------------------------------
    // SEARCH PARAMS
    // ----------------------------------------

    const params = await searchParams;

    const searchValue =
        params.search?.trim() ?? "";

    // ----------------------------------------
    // AUTH
    // ----------------------------------------

    const session = await auth0.getSession();

    if (!session) {
        return null;
    }

    const { token } =
        await auth0.getAccessToken();

    if (!token) {
        throw new Error(
            "Could not obtain an Auth0 access token."
        );
    }

    // ----------------------------------------
    // LOCATIONS
    // ----------------------------------------

    const {
        storageLocations,
    } =
        await graphqlRequest<StorageLocationsResponse>(
            STORAGE_LOCATIONS_QUERY,
            {
                ...(searchValue
                    ? {
                        search: {
                            columns: {
                                strings: [
                                    "name",
                                    "code",
                                    "description",
                                ],
                            },
                            value: searchValue,
                        },
                    }
                    : {}),

                orderBy: {
                    field: "name",
                    value: "asc",
                },
            },
            token
        );

    if (storageLocations.error) {
        throw new Error(
            storageLocations.error
        );
    }

    const locations =
        storageLocations.data ?? [];

    // ----------------------------------------
    // METRICS
    // ----------------------------------------

    const totalLocations =
        storageLocations.count;

    const totalSamples =
        locations.reduce(
            (total, location) =>
                total + location.sampleCount,
            0
        );

    const totalArea =
        locations.reduce(
            (total, location) =>
                total +
                (location.maxAreaCm2 ?? 0),
            0
        );

    const usedArea =
        locations.reduce(
            (total, location) =>
                total + location.usedAreaCm2,
            0
        );

    const availableArea =
        Math.max(
            totalArea - usedArea,
            0
        );

    const generalOccupancy =
        totalArea > 0
            ? Math.round(
                (usedArea / totalArea) * 100
            )
            : 0;

    // ----------------------------------------
    // RENDER
    // ----------------------------------------

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
                            Consulta los espacios disponibles
                            del laboratorio, su ocupación y las
                            muestras almacenadas.
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
                        subtitle="En las ubicaciones mostradas"
                        icon={<FlaskConical size={20} />}
                        compact
                    />

                    <MetricCard
                        title="Área disponible"
                        value={`${Math.round(
                            availableArea
                        ).toLocaleString()} cm²`}
                        subtitle={`De ${Math.round(
                            totalArea
                        ).toLocaleString()} cm²`}
                        icon={<CheckCircle2 size={20} />}
                        compact
                    />

                    <MetricCard
                        title="Ocupación general"
                        value={`${generalOccupancy}%`}
                        subtitle="Área utilizada"
                        icon={<Box size={20} />}
                        compact
                    />
                </section>

                {/* Search */}

                <section className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
                    <form
                        method="GET"
                        className="flex max-w-2xl gap-3"
                    >
                        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3">
                            <Search
                                size={18}
                                className="shrink-0 text-accent"
                            />

                            <input
                                type="text"
                                name="search"
                                defaultValue={searchValue}
                                placeholder="Buscar por código, nombre, tipo o descripción..."
                                className="w-full bg-transparent text-sm outline-none placeholder:text-secondary/50"
                            />
                        </div>

                        <button
                            type="submit"
                            className="rounded-2xl bg-accent px-5 py-3 text-sm font-extrabold text-white transition hover:opacity-90"
                        >
                            Buscar
                        </button>

                        {searchValue && (
                            <Link
                                href="/locations"
                                className="flex items-center rounded-2xl border border-border bg-white px-5 py-3 text-sm font-bold text-primary transition hover:border-accent hover:text-accent"
                            >
                                Limpiar
                            </Link>
                        )}
                    </form>
                </section>

                {/* Locations */}

                <section>
                    <div className="mb-5">
                        <h2 className="text-xl font-black text-primary">
                            Espacios de almacenamiento
                        </h2>

                        <p className="mt-1 text-sm text-secondary">
                            {searchValue
                                ? `${totalLocations} resultado${totalLocations === 1
                                    ? ""
                                    : "s"
                                } para "${searchValue}".`
                                : "Cada tarjeta representa una ubicación independiente dentro del laboratorio."}
                        </p>
                    </div>

                    {locations.length > 0 ? (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {locations.map(
                                (location) => (
                                    <LocationOverviewCard
                                        key={location.id}
                                        location={location}
                                    />
                                )
                            )}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-border bg-surface p-8 text-center shadow-sm">
                            <MapPin
                                size={32}
                                className="mx-auto text-secondary"
                            />

                            <h3 className="mt-4 font-black text-primary">
                                {searchValue
                                    ? "No encontramos resultados"
                                    : "No hay ubicaciones"}
                            </h3>

                            <p className="mt-2 text-sm text-secondary">
                                {searchValue
                                    ? `No hay ubicaciones que coincidan con "${searchValue}".`
                                    : "Todavía no hay ubicaciones de almacenamiento registradas."}
                            </p>

                            {searchValue && (
                                <Link
                                    href="/locations"
                                    className="mt-5 inline-flex rounded-2xl bg-accent px-5 py-3 text-sm font-bold text-white"
                                >
                                    Ver todas las ubicaciones
                                </Link>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}