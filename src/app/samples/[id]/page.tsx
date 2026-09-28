import {
  redirect,
  notFound,
} from "next/navigation";

import { AppLayout } from "@/components/layout/AppLayout";

import { SampleWorkspace } from "@/components/samples/SampleWorkspace";

import type {
  SampleData,
} from "@/components/samples/types";

import { auth0 } from "@/lib/auth0";

import {
  graphqlRequest,
} from "@/lib/graphql/client";

import {
  SAMPLE_QUERY,
  STORAGE_RECOMMENDATIONS_QUERY,
  type SampleResponse,
  type StorageRecommendationsResponse,
} from "@/lib/graphql/samples";

import {
  LABORATORIES_QUERY,
  MATERIAL_TYPES_QUERY,
  type LaboratoriesResponse,
  type MaterialTypesResponse,
} from "@/lib/graphql/sampleOptions";

import {
  ME_QUERY,
  type MeResponse,
} from "@/lib/graphql/profile";

export default async function SamplePage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  // ----------------------------------------
  // MODE
  // ----------------------------------------

  const isNew =
    id.toLowerCase() === "new";

  // ----------------------------------------
  // AUTH
  // ----------------------------------------

  const session =
    await auth0.getSession();

  if (!session) {
    redirect(
      `/auth/login?returnTo=/samples/${id}`
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

  const {
    me,
  } = await graphqlRequest<MeResponse>(
    ME_QUERY,
    {},
    token
  );

  if (!me) {
    throw new Error(
      "Could not load the current user."
    );
  }

  // ----------------------------------------
  // MATERIAL TYPES
  // Used in both create and edit modes
  // ----------------------------------------

  const {
    materialTypes,
  } =
    await graphqlRequest<MaterialTypesResponse>(
      MATERIAL_TYPES_QUERY,
      {},
      token
    );

  const materialTypeOptions =
    materialTypes.data ?? [];

  // ----------------------------------------
  // NEW SAMPLE
  // ----------------------------------------

  if (isNew) {
    if (!me.organization) {
      throw new Error(
        "The current user does not belong to an organization."
      );
    }

    // ----------------------------------------
    // LABORATORIES
    // Only laboratories from the user's
    // organization should be available.
    // ----------------------------------------

    const {
      laboratories,
    } =
      await graphqlRequest<LaboratoriesResponse>(
        LABORATORIES_QUERY,
        {
          where: {
            organizationId: {
              equals: Number(
                me.organization.id
              ),
            },
          },
        },
        token
      );

    const laboratoryOptions =
      laboratories.data ?? [];

    return (
      <AppLayout>
        <SampleWorkspace
          isNew
          laboratories={
            laboratoryOptions
          }
          materialTypes={
            materialTypeOptions
          }
        />
      </AppLayout>
    );
  }

  // ----------------------------------------
  // VALIDATE SAMPLE ID
  // ----------------------------------------

  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    notFound();
  }

  // ----------------------------------------
  // GET SAMPLE
  // ----------------------------------------

  const {
    sample,
  } =
    await graphqlRequest<SampleResponse>(
      SAMPLE_QUERY,
      {
        id: numericId,
      },
      token
    );

  if (!sample) {
    notFound();
  }

  // ----------------------------------------
  // GET STORAGE RECOMMENDATIONS
  // ----------------------------------------

  const {
    recommendedStorageLocations,
  } =
    await graphqlRequest<StorageRecommendationsResponse>(
      STORAGE_RECOMMENDATIONS_QUERY,
      {
        sampleId: numericId,
      },
      token
    );

  // ----------------------------------------
  // ADAPT API -> UI
  // ----------------------------------------

  const sampleData: SampleData = {
    // ----------------------------------------
    // IDENTIFIERS
    // ----------------------------------------

    id: String(sample.id),

    laboratoryId:
      sample.laboratoryId,

    materialTypeId:
      sample.materialTypeId,

    // ----------------------------------------
    // GENERAL DATA
    // ----------------------------------------

    name:
      sample.name,

    code:
      sample.code,

    type:
      sample.materialType.name,

    description:
      sample.description ?? "",

    status:
      sample.status,

    // ----------------------------------------
    // PHYSICAL DATA
    // ----------------------------------------

    weight:
      String(sample.weightG),

    volume:
      String(sample.volumeCm3),

    area:
      String(sample.areaCm2),

    // ----------------------------------------
    // DATES
    // input[type="date"] requires YYYY-MM-DD
    // ----------------------------------------

    entryDate:
      sample.entryDate
        ? sample.entryDate.slice(
            0,
            10
          )
        : "",

    expirationDate:
      sample.expirationDate
        ? sample.expirationDate.slice(
            0,
            10
          )
        : "",

    // ----------------------------------------
    // STORAGE REQUIREMENTS
    // ----------------------------------------

    isStackable:
      sample.isStackable,

    maxStackUnits:
      sample.maxStackUnits,

    requiresColdStorage:
      sample.requiresColdStorage,

    requiresLightProtection:
      sample.requiresLightProtection,

    isHazardous:
      sample.isHazardous,

    // ----------------------------------------
    // CURRENT LOCATION
    // ----------------------------------------

    locationId:
      sample.storageLocation
        ? String(
            sample.storageLocation.id
          )
        : "",

    locationCode:
      sample.storageLocation?.code ??
      "",

    locationName:
      sample.storageLocation?.name ??
      "Sin ubicación",
  };

  // ----------------------------------------
  // RENDER EDIT MODE
  // ----------------------------------------

  return (
    <AppLayout>
      <SampleWorkspace
        isNew={false}
        initialData={sampleData}
        recommendations={
          recommendedStorageLocations
        }
        materialTypes={
          materialTypeOptions
        }
      />
    </AppLayout>
  );
}