import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

import { AppLayout } from "@/components/layout/AppLayout";
import { LocationForm } from "@/components/locations/LocationForm";

import { auth0 } from "@/lib/auth0";
import { graphqlRequest } from "@/lib/graphql/client";

import {
  LABORATORIES_QUERY,
  type LaboratoriesResponse,
} from "@/lib/graphql/sampleOptions";

import {
  ME_QUERY,
  type MeResponse,
} from "@/lib/graphql/profile";

export default async function NewStorageUnitPage() {
  // ----------------------------------------
  // AUTH
  // ----------------------------------------

  const session = await auth0.getSession();

  if (!session) {
    redirect(
      "/auth/login?returnTo=/locations/new"
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
  // USER
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
  // LABORATORIES
  // ----------------------------------------

  const { laboratories } =
    await graphqlRequest<LaboratoriesResponse>(
      LABORATORIES_QUERY,
      {
        where: {
          AND: [
            {
              organizationId: {
                equals: Number(
                  me.organization.id
                ),
              }
            }
          ]

        },
      },
      token
    );

  const laboratoryOptions =
    laboratories.data ?? [];

  // ----------------------------------------
  // RENDER
  // ----------------------------------------

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-accent"
          >
            <ArrowLeft size={18} />
            Volver a ubicaciones
          </Link>

          <h1 className="mt-4 text-4xl font-black text-primary">
            Nueva ubicación
          </h1>

          <p className="mt-2 text-secondary">
            Registra una nueva ubicación de
            almacenamiento y define su capacidad
            y condiciones.
          </p>
        </div>

        <LocationForm
          mode="create"
          laboratories={
            laboratoryOptions
          }
        />
      </div>
    </AppLayout>
  );
}