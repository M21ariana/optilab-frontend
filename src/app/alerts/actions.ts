"use server";

import { auth0 } from "@/lib/auth0";
import { graphqlRequest } from "@/lib/graphql/client";

import {
  ALERTS_QUERY,
  type AlertsResponse,
  type Alert,
} from "@/lib/graphql/alerts";

// ----------------------------------------
// GET ACTIVE ALERTS
// ----------------------------------------

export async function getActiveAlerts(): Promise<
  Alert[]
> {
  const session =
    await auth0.getSession();

  if (!session) {
    throw new Error(
      "Authentication required."
    );
  }

  const { token } =
    await auth0.getAccessToken();

  if (!token) {
    throw new Error(
      "Could not obtain an Auth0 access token."
    );
  }

  const result =
    await graphqlRequest<AlertsResponse>(
      ALERTS_QUERY,
      {
        where: {
          isResolved: {
            equals: false,
          },
        },

        take: 10,

        orderBy: {
          field: "createdAt",
          value: "desc",
        },
      },
      token
    );

  if (result.alerts.status !== 200) {
    throw new Error(
      result.alerts.error ??
        "Could not load alerts."
    );
  }

  return result.alerts.data ?? [];
}