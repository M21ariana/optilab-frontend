"use server";

import { auth0 } from "@/lib/auth0";
import { graphqlRequest } from "@/lib/graphql/client";

import {
  CREATE_STORAGE_LOCATION_MUTATION,
  UPDATE_STORAGE_LOCATION_MUTATION,
  type CreateStorageLocationResponse,
  type UpdateStorageLocationResponse,
} from "@/lib/graphql/locations";

// ----------------------------------------
// TYPES
// ----------------------------------------

export type StorageLocationFormInput = {
  laboratoryId: number;

  name: string;
  code: string;
  type: string;
  description?: string;

  maxVolumeCm3?: number;
  maxAreaCm2?: number;
  maxWeightG?: number;

  supportsColdStorage: boolean;
  supportsLightProtection: boolean;
  supportsHazardous: boolean;
};

// ----------------------------------------
// CREATE
// ----------------------------------------

export async function createStorageLocation(
  data: StorageLocationFormInput
) {
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
    await graphqlRequest<CreateStorageLocationResponse>(
      CREATE_STORAGE_LOCATION_MUTATION,
      {
        data,
      },
      token
    );

  if (!result.createStorageLocation) {
    throw new Error(
      "Could not create storage location."
    );
  }

  return {
    id: result.createStorageLocation.id,
  };
}

// ----------------------------------------
// UPDATE
// ----------------------------------------

export async function updateStorageLocation(
  id: number,
  data: StorageLocationFormInput
) {
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
    await graphqlRequest<UpdateStorageLocationResponse>(
      UPDATE_STORAGE_LOCATION_MUTATION,
      {
        where: {
          id,
        },
        data,
      },
      token
    );

  if (!result.updateStorageLocation) {
    throw new Error(
      "Could not update storage location."
    );
  }

  return {
    id: result.updateStorageLocation.id,
  };
}