"use server";

import { auth0 } from "@/lib/auth0";
import { graphqlRequest } from "@/lib/graphql/client";

import {
  CREATE_SAMPLE_MUTATION,
  UPDATE_SAMPLE_MUTATION,
  STORAGE_RECOMMENDATIONS_QUERY,
  MOVE_SAMPLE_MUTATION,
  type CreateSampleInput,
  type CreateSampleResponse,
  type UpdateSampleInput,
  type UpdateSampleResponse,
  type StorageRecommendationsResponse,
  type MoveSampleInput,
  type MoveSampleResponse,
} from "@/lib/graphql/samples";

// ======================================================
// CREATE SAMPLE
// ======================================================

export async function createSampleAction(
  data: CreateSampleInput
) {
  const { token } =
    await auth0.getAccessToken();

  if (!token) {
    throw new Error(
      "No se encontró una sesión autenticada."
    );
  }

  const result =
    await graphqlRequest<CreateSampleResponse>(
      CREATE_SAMPLE_MUTATION,
      {
        data,
      },
      token
    );

  return result.createSample;
}

// ======================================================
// UPDATE SAMPLE
// ======================================================

export async function updateSampleAction(
  id: number,
  data: UpdateSampleInput
) {
  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new Error(
      "El ID de la muestra no es válido."
    );
  }

  const { token } =
    await auth0.getAccessToken();

  if (!token) {
    throw new Error(
      "No se encontró una sesión autenticada."
    );
  }

  const result =
    await graphqlRequest<UpdateSampleResponse>(
      UPDATE_SAMPLE_MUTATION,
      {
        where: {
          id,
        },
        data,
      },
      token
    );

  return result.updateSample;
}

// ======================================================
// MOVE SAMPLE
// ======================================================

export async function moveSampleAction(
  sampleId: number,
  toLocationId: number,
  notes: string
) {
  if (
    !Number.isInteger(sampleId) ||
    sampleId <= 0
  ) {
    throw new Error(
      "El ID de la muestra no es válido."
    );
  }

  if (
    !Number.isInteger(toLocationId) ||
    toLocationId <= 0
  ) {
    throw new Error(
      "El ID de la ubicación no es válido."
    );
  }

  if (!notes.trim()) {
    throw new Error(
      "Debes indicar el motivo del movimiento."
    );
  }

  const { token } =
    await auth0.getAccessToken();

  if (!token) {
    throw new Error(
      "No se encontró una sesión autenticada."
    );
  }

  const data: MoveSampleInput = {
    sampleId,
    toLocationId,
    notes: notes.trim(),
  };

  const result =
    await graphqlRequest<MoveSampleResponse>(
      MOVE_SAMPLE_MUTATION,
      {
        data,
      },
      token
    );

  return result.moveSample;
}

// ======================================================
// GET STORAGE RECOMMENDATIONS
// ======================================================

export async function getStorageRecommendationsAction(
  sampleId: number
) {
  if (
    !Number.isInteger(sampleId) ||
    sampleId <= 0
  ) {
    throw new Error(
      "El ID de la muestra no es válido."
    );
  }

  const { token } =
    await auth0.getAccessToken();

  if (!token) {
    throw new Error(
      "No se encontró una sesión autenticada."
    );
  }

  const result =
    await graphqlRequest<StorageRecommendationsResponse>(
      STORAGE_RECOMMENDATIONS_QUERY,
      {
        sampleId,
      },
      token
    );

  return result.recommendedStorageLocations;
}