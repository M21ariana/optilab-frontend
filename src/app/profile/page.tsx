import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileForm } from "@/components/profile/ProfileForm";

import {
  Building2,
  Mail,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";

const user = {
  fullName: "María González",
  email: "maria.gonzalez@optilab.com",
  role: "Administrador",
  organization: "OptiLab",
};

export default function ProfilePage() {
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
            Consulta y actualiza la información asociada a tu cuenta de
            OptiLab.
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