"use server";

import { auth0 } from "@/lib/auth0";
import { graphqlRequest } from "@/lib/graphql/client";

import {
  UPDATE_MY_PROFILE_MUTATION,
  type UpdateMyProfileResponse,
} from "@/lib/graphql/profile";

export async function updateProfileAction(
  fullName: string
) {
  const normalizedName = fullName.trim();

  if (!normalizedName) {
    throw new Error(
      "El nombre no puede estar vacío."
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
    await graphqlRequest<UpdateMyProfileResponse>(
      UPDATE_MY_PROFILE_MUTATION,
      {
        fullName: normalizedName,
      },
      token
    );

  return result.updateMyProfile;
}