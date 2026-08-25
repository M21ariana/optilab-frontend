"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SampleDetails } from "./SampleDetails";
import { SampleForm } from "./SampleForm";
import type { SampleData } from "./types";

type SampleWorkspaceProps = {
  isNew: boolean;
  initialData?: SampleData;
};

export function SampleWorkspace({
  isNew,
  initialData,
}: SampleWorkspaceProps) {
  const router = useRouter();

  const [sample, setSample] = useState<
    SampleData | undefined
  >(initialData);

  const [isEditing, setIsEditing] =
    useState(isNew);

  function handleSave(data: SampleData) {
    if (isNew) {
      // Temporal mientras no existe backend.
      // Más adelante aquí irá createSample().
      router.push("/samples");
      return;
    }

    // Temporal mientras no existe backend.
    // Más adelante aquí irá updateSample().
    setSample(data);
    setIsEditing(false);
  }

  function handleCancel() {
    if (isNew) {
      router.push("/samples");
      return;
    }

    setIsEditing(false);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link
          href="/samples"
          className="inline-flex items-center gap-2 text-sm font-bold text-secondary transition hover:text-accent"
        >
          <ArrowLeft size={18} />
          Volver a muestras
        </Link>

        {isNew ? (
          <>
            <h1 className="mt-4 text-4xl font-black text-primary">
              Nueva muestra
            </h1>

            <p className="mt-2 max-w-3xl text-secondary">
              Registra las características de la muestra para que OptiLab
              identifique las ubicaciones compatibles.
            </p>
          </>
        ) : isEditing ? (
          <>
            <h1 className="mt-4 text-4xl font-black text-primary">
              Editar muestra
            </h1>

            <p className="mt-2 text-secondary">
              Actualiza la información de la muestra o registra un cambio de
              ubicación.
            </p>
          </>
        ) : null}
      </div>

      {isEditing ? (
        <SampleForm
          mode={isNew ? "create" : "edit"}
          initialData={sample}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : sample ? (
        <SampleDetails
          sample={sample}
          onEdit={() => setIsEditing(true)}
        />
      ) : null}
    </div>
  );
}