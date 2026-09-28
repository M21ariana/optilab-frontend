import { redirect } from "next/navigation";

import { AppLayout } from "@/components/layout/AppLayout";
import { MovementsWorkspace} from "@/components/movements/MovementsWorkspace";

import { auth0 } from "@/lib/auth0";

import {
  graphqlRequest,
} from "@/lib/graphql/client";

import {
  SAMPLE_MOVEMENTS_QUERY,
  type SampleMovementsResponse,
} from "@/lib/graphql/movements";

export default async function MovementsPage() {
  // ----------------------------------------
  // AUTH
  // ----------------------------------------

  const session =
    await auth0.getSession();

  if (!session) {
    redirect(
      "/auth/login?returnTo=/movements"
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
  // MOVEMENTS
  // ----------------------------------------
  //
  // Organization filtering is applied
  // automatically by the backend using the
  // authenticated user's organization.
  //
  // ----------------------------------------

  const {
    sampleMovements,
  } =
    await graphqlRequest<SampleMovementsResponse>(
      SAMPLE_MOVEMENTS_QUERY,
      {
        where: {},
        orderBy: {
          field: "createdAt",
          value: "desc",
        },
      },
      token
    );

  // ----------------------------------------
  // BACKEND ERROR
  // ----------------------------------------

  if (
    sampleMovements.status &&
    sampleMovements.status >= 400
  ) {
    throw new Error(
      sampleMovements.error ??
        "Could not load sample movements."
    );
  }

  // ----------------------------------------
  // DATA
  // ----------------------------------------

  const movements =
    sampleMovements.data ?? [];

  // ----------------------------------------
  // RENDER
  // ----------------------------------------

  return (
    <AppLayout>
      <MovementsWorkspace
        movements={movements}
      />
    </AppLayout>
  );
}