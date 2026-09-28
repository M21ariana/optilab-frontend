import Link from "next/link";

import {
    ArrowLeft,
} from "lucide-react";

import {
    notFound,
    redirect,
} from "next/navigation";

import { AppLayout } from "@/components/layout/AppLayout";
import { LocationForm } from "@/components/locations/LocationForm";

import { auth0 } from "@/lib/auth0";
import { graphqlRequest } from "@/lib/graphql/client";

import {
    STORAGE_LOCATION_QUERY,
    type StorageLocationResponse,
} from "@/lib/graphql/locations";

import {
    LABORATORIES_QUERY,
    type LaboratoriesResponse,
} from "@/lib/graphql/sampleOptions";

import {
    ME_QUERY,
    type MeResponse,
} from "@/lib/graphql/profile";

// ----------------------------------------
// PAGE
// ----------------------------------------

export default async function EditStorageUnitPage({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {
    const { id } = await params;

    // ----------------------------------------
    // VALIDATE ID
    // ----------------------------------------

    const numericId =
        Number(id);

    if (Number.isNaN(numericId)) {
        notFound();
    }

    // ----------------------------------------
    // AUTH
    // ----------------------------------------

    const session =
        await auth0.getSession();

    if (!session) {
        redirect(
            `/auth/login?returnTo=/locations/${id}/edit`
        );
    }

    const { token } =
        await auth0.getAccessToken();

    if (!token) {
        throw new Error(
            "Could not obtain an Auth0 access token."
        );
    }

    // ----------------------------------------
    // CURRENT USER
    // ----------------------------------------

    const { me } =
        await graphqlRequest<MeResponse>(
            ME_QUERY,
            {},
            token
        );

    if (!me?.organization) {
        throw new Error(
            "The current user does not belong to an organization."
        );
    }

    // ----------------------------------------
    // LOCATION
    // ----------------------------------------

    const {
        storageLocation,
    } =
        await graphqlRequest<StorageLocationResponse>(
            STORAGE_LOCATION_QUERY,
            {
                id: numericId,
            },
            token
        );


    if (!storageLocation) {
        notFound();
    }

    // ----------------------------------------
    // LABORATORIES
    // ----------------------------------------

    const {
        laboratories,
    } =
        await graphqlRequest<LaboratoriesResponse>(
            LABORATORIES_QUERY,
            {
                where: {
                    AND: [
                        {
                            organizationId: {
                                equals: Number(me.organization.id),
                            }
                        }
                    ]
                }
            },
            token
        );

    const laboratoryOptions =
        laboratories.data ?? [];

    // ----------------------------------------
    // INITIAL DATA
    // ----------------------------------------

    const initialData = {
        id:
            String(storageLocation.id),

        laboratoryId:
            storageLocation.laboratoryId,

        name:
            storageLocation.name,

        code:
            storageLocation.code,

        type:
            storageLocation.type,

        description:
            storageLocation.description ?? "",

        maxVolumeCm3:
            storageLocation.maxVolumeCm3,

        maxAreaCm2:
            storageLocation.maxAreaCm2,

        maxWeightG:
            storageLocation.maxWeightG,

        supportsColdStorage:
            storageLocation.supportsColdStorage,

        supportsLightProtection:
            storageLocation.supportsLightProtection,

        supportsHazardous:
            storageLocation.supportsHazardous,
    };

    // ----------------------------------------
    // RENDER
    // ----------------------------------------

    return (
        <AppLayout>
            <div className="mx-auto max-w-5xl space-y-8">
                <div>
                    <Link
                        href={`/locations/${id}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-accent"
                    >
                        <ArrowLeft size={18} />

                        Volver al detalle
                    </Link>

                    <h1 className="mt-4 text-4xl font-black text-primary">
                        Editar ubicación
                    </h1>

                    <p className="mt-2 text-secondary">
                        Actualiza la información, capacidad
                        y condiciones de almacenamiento de
                        esta ubicación.
                    </p>
                </div>

                <LocationForm
                    mode="edit"
                    laboratories={
                        laboratoryOptions
                    }
                    initialData={
                        initialData
                    }
                />
            </div>
        </AppLayout>
    );
}