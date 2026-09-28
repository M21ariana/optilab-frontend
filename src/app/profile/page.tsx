import { redirect } from "next/navigation";

import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileForm } from "@/components/profile/ProfileForm";

import { auth0 } from "@/lib/auth0";
import { graphqlRequest } from "@/lib/graphql/client";
import {
  ME_QUERY,
  MeResponse,
} from "@/lib/graphql/profile";

import {
  Building2,
  Mail,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";

export default async function ProfilePage() {
  // 1. Confirm that the user has an Auth0 session
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login?returnTo=/profile");
  }

  // 2. Get an access token for the OptiLab API
  const { token } = await auth0.getAccessToken();

  if (!token) {
    throw new Error(
      "Could not obtain an Auth0 access token."
    );
  }

  // 3. Request the authenticated OptiLab user
  const { me } = await graphqlRequest<MeResponse>(
    ME_QUERY,
    undefined,
    token
  );

  if (!me) {
    throw new Error(
      "Authenticated user was not found in OptiLab."
    );
  }

  // 4. Adapt backend data to the current UI
  const user = {
    fullName:
      me.fullName || "Nombre pendiente",
    email: me.email,
    role:
      me.role || "Sin rol asignado",
    organization:
      me.organization?.name ||
      "Sin organización asignada",
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <section>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
            Cuenta
          </p>

          <h1 className="mt-2 text-4xl font-black text-primary">
            Mi perfil
          </h1>

          <p className="mt-2 max-w-2xl text-secondary">
            Consulta y actualiza la información
            asociada a tu cuenta de OptiLab.
          </p>
        </section>

        {/* User summary */}
        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-accent/10 text-accent">
              <UserCircle2 size={42} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-black text-primary">
                {user.fullName}
              </h2>

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-secondary">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  {user.email}
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} />
                  {user.role}
                </div>

                <div className="flex items-center gap-2">
                  <Building2 size={16} />
                  {user.organization}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form */}
        <ProfileForm initialData={user} />
      </div>
    </AppLayout>
  );
}