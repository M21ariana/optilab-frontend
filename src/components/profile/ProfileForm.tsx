"use client";

import {
  Building2,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ReadOnlyField } from "./ReadOnlyField";
import { updateProfileAction } from "@/app/profile/actions";

type ProfileFormProps = {
  initialData: {
    fullName: string;
    email: string;
    role: string;
    organization: string;
  };
};

export function ProfileForm({
  initialData,
}: ProfileFormProps) {
  const router = useRouter();

  const [fullName, setFullName] = useState(
    initialData.fullName
  );

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(
    null
  );

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaved(false);
    setError(null);

    const normalizedName = fullName.trim();

    if (!normalizedName) {
      setError(
        "El nombre no puede estar vacío."
      );
      return;
    }

    try {
      setSaving(true);

      const updatedUser =
        await updateProfileAction(
          normalizedName
        );

      setFullName(
        updatedUser.fullName ??
          normalizedName
      );

      setSaved(true);

      router.refresh();

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No fue posible guardar los cambios."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-border bg-surface p-6 shadow-sm"
    >
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Información personal
        </p>

        <h2 className="mt-2 text-xl font-black text-primary">
          Datos de perfil
        </h2>

        <p className="mt-2 text-sm text-secondary">
          Actualiza la información personal asociada a tu cuenta.
        </p>
      </div>

      {/* Form fields */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Nombre completo */}
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-primary">
            Nombre completo
          </span>

          <div className="group flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 transition hover:border-accent/60 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10">
            <UserRound
              size={18}
              className="shrink-0 text-accent transition group-focus-within:scale-105"
            />

            <input
              type="text"
              value={fullName}
              disabled={saving}
              onChange={(event) => {
                setFullName(
                  event.target.value
                );
                setSaved(false);
                setError(null);
              }}
              className="w-full bg-transparent text-sm font-medium text-primary outline-none disabled:opacity-60"
            />
          </div>
        </label>

        {/* Correo electrónico */}
        <ReadOnlyField
          label="Correo electrónico"
          value={initialData.email}
          icon={<Mail size={18} />}
        />

        {/* Organización */}
        <ReadOnlyField
          label="Organización"
          value={initialData.organization}
          icon={<Building2 size={18} />}
        />

        {/* Rol */}
        <ReadOnlyField
          label="Rol"
          value={initialData.role}
          icon={<ShieldCheck size={18} />}
        />
      </div>

      {/* Footer */}
      <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {saved && (
            <p className="text-sm font-bold text-accent">
              Cambios guardados correctamente.
            </p>
          )}

          {error && (
            <p className="text-sm font-bold text-red-600">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-accent/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={18} />

          {saving
            ? "Guardando..."
            : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}