"use client";

import {
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import { SampleMoveForm } from "./SampleMoveForm";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  useState,
} from "react";

import {
  createSampleAction,
  getStorageRecommendationsAction,
  moveSampleAction,
  updateSampleAction,
} from "@/app/samples/actions";

import {
  SampleDetails,
} from "./SampleDetails";

import {
  SampleForm,
} from "./SampleForm";

import type {
  SampleData,
} from "./types";

import type {
  StorageRecommendation,
  CreateSampleInput,
  UpdateSampleInput,
} from "@/lib/graphql/samples";

import type {
  LaboratoryOption,
  MaterialTypeOption,
} from "@/lib/graphql/sampleOptions";

// ======================================================
// TYPES
// ======================================================

type SampleWorkspaceProps = {
  isNew: boolean;
  initialData?: SampleData;
  recommendations?: StorageRecommendation[];
  laboratories?: LaboratoryOption[];
  materialTypes?: MaterialTypeOption[];
};

type CreationStep =
  | "form"
  | "location";

// ======================================================
// COMPONENT
// ======================================================

export function SampleWorkspace({
  isNew,
  initialData,
  recommendations = [],
  laboratories = [],
  materialTypes = [],
}: SampleWorkspaceProps) {
  const router = useRouter();

  const [sample, setSample] = useState<
    SampleData | undefined
  >(initialData);

  const [isEditing, setIsEditing] =
    useState(isNew);

  const [isMoving, setIsMoving] =
    useState(false);

  // ------------------------------------------------------
  // CREATE FLOW
  // ------------------------------------------------------

  const [creationStep, setCreationStep] =
    useState<CreationStep>("form");

  const [
    createdSampleId,
    setCreatedSampleId,
  ] = useState<number | null>(null);

  const [
    creationRecommendations,
    setCreationRecommendations,
  ] = useState<StorageRecommendation[]>([]);

  const [
    selectedInitialLocationId,
    setSelectedInitialLocationId,
  ] = useState("");

  // ------------------------------------------------------
  // UI STATE
  // ------------------------------------------------------

  const [isSaving, setIsSaving] =
    useState(false);

  const [
    isSavingLocation,
    setIsSavingLocation,
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  // ======================================================
  // CREATE SAMPLE
  // ======================================================

  async function handleCreateSample(
    data: SampleData
  ) {
    if (
      !data.laboratoryId ||
      !data.materialTypeId
    ) {
      setError(
        "Debes seleccionar un laboratorio y un tipo de material."
      );

      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const createData: CreateSampleInput = {
        laboratoryId:
          data.laboratoryId,

        materialTypeId:
          data.materialTypeId,

        name:
          data.name.trim(),

        code:
          data.code.trim(),

        description:
          data.description.trim() || undefined,

        weightG:
          Number(data.weight),

        volumeCm3:
          Number(data.volume),

        areaCm2:
          Number(data.area),

        status:
          data.status,

        entryDate:
          data.entryDate || undefined,

        expirationDate:
          data.expirationDate || undefined,

        isStackable:
          data.isStackable,

        maxStackUnits:
          data.isStackable
            ? data.maxStackUnits ?? undefined
            : undefined,

        requiresColdStorage:
          data.requiresColdStorage,

        requiresLightProtection:
          data.requiresLightProtection,

        isHazardous:
          data.isHazardous,

        // IMPORTANT:
        // storageLocationId is intentionally omitted.
        // The initial location is assigned in step 2.
      };

      // --------------------------------------------------
      // 1. CREATE SAMPLE
      // --------------------------------------------------

      const createdSample =
        await createSampleAction(
          createData
        );

      const sampleId =
        Number(createdSample.id);

      if (
        !Number.isInteger(sampleId) ||
        sampleId <= 0
      ) {
        throw new Error(
          "El backend no devolvió un ID válido para la muestra."
        );
      }

      setCreatedSampleId(
        sampleId
      );

      // Keep the submitted information locally.
      setSample({
        ...data,
        id: String(sampleId),
        locationId: "",
        locationCode: "",
        locationName: "Sin ubicación",
      });

      // --------------------------------------------------
      // 2. GET RECOMMENDATIONS
      // --------------------------------------------------

      const storageRecommendations =
        await getStorageRecommendationsAction(
          sampleId
        );

      setCreationRecommendations(
        storageRecommendations
      );

      setSelectedInitialLocationId("");

      // --------------------------------------------------
      // 3. MOVE UI TO LOCATION STEP
      // --------------------------------------------------

      setCreationStep("location");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo crear la muestra."
      );
    } finally {
      setIsSaving(false);
    }
  }

  // ======================================================
  // ASSIGN INITIAL LOCATION
  // ======================================================

  async function handleSaveInitialLocation() {
    if (!createdSampleId) {
      setError(
        "No se encontró la muestra creada."
      );

      return;
    }

    if (!selectedInitialLocationId) {
      setError(
        "Selecciona una ubicación."
      );

      return;
    }

    const storageLocationId =
      Number(selectedInitialLocationId);

    if (
      !Number.isInteger(
        storageLocationId
      ) ||
      storageLocationId <= 0
    ) {
      setError(
        "La ubicación seleccionada no es válida."
      );

      return;
    }

    setIsSavingLocation(true);
    setError(null);

    try {
      // Initial assignment:
      //
      // null -> storageLocationId
      //
      // We intentionally DO NOT send
      // movementReason here.

      await updateSampleAction(
        createdSampleId,
        {
          storageLocationId,
        }
      );

      router.push(
        `/samples/${createdSampleId}`
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar la ubicación."
      );
    } finally {
      setIsSavingLocation(false);
    }
  }

  // ======================================================
  // UPDATE EXISTING SAMPLE
  // ======================================================

  async function handleUpdateSample(
    data: SampleData
  ) {
    if (!data.id) {
      setError(
        "No se encontró el ID de la muestra."
      );

      return;
    }

    const sampleId = Number(data.id);

    if (
      !Number.isInteger(sampleId) ||
      sampleId <= 0
    ) {
      setError(
        "El ID de la muestra no es válido."
      );

      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updateData: UpdateSampleInput = {
        laboratoryId:
          data.laboratoryId,

        materialTypeId:
          data.materialTypeId,

        name:
          data.name.trim(),

        code:
          data.code.trim(),

        description:
          data.description.trim(),

        weightG:
          Number(data.weight),

        volumeCm3:
          Number(data.volume),

        areaCm2:
          Number(data.area),

        status:
          data.status,

        entryDate:
          data.entryDate,

        expirationDate:
          data.expirationDate ||
          undefined,

        isStackable:
          data.isStackable,

        maxStackUnits:
          data.isStackable
            ? data.maxStackUnits ??
            undefined
            : undefined,

        requiresColdStorage:
          data.requiresColdStorage,

        requiresLightProtection:
          data.requiresLightProtection,

        isHazardous:
          data.isHazardous,
      };

      // --------------------------------------------------
      // INITIAL LOCATION
      // --------------------------------------------------
      //
      // Editing can only assign a location when the
      // sample currently has no location.
      //
      // null -> location = ENTRY
      //
      // Existing locations are managed through
      // moveSample / removeSample.
      // --------------------------------------------------

      const hadInitialLocation =
        Boolean(initialData?.locationId);

      if (
        !hadInitialLocation &&
        data.locationId
      ) {
        const storageLocationId =
          Number(data.locationId);

        if (
          !Number.isInteger(
            storageLocationId
          ) ||
          storageLocationId <= 0
        ) {
          throw new Error(
            "La ubicación seleccionada no es válida."
          );
        }

        updateData.storageLocationId =
          storageLocationId;
      }

      // --------------------------------------------------
      // UPDATE
      // --------------------------------------------------

      await updateSampleAction(
        sampleId,
        updateData
      );

      setSample(data);
      setIsEditing(false);

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar la muestra."
      );
    } finally {
      setIsSaving(false);
    }
  }

  // ======================================================
  // FORM SAVE
  // ======================================================

  async function handleSave(
    data: SampleData
  ) {
    if (isNew) {
      await handleCreateSample(data);
      return;
    }

    await handleUpdateSample(data);
  }

  // ======================================================
  // CANCEL
  // ======================================================

  function handleCancel() {
    if (isNew) {
      router.push("/samples");

      return;
    }

    setIsEditing(false);
    setError(null);
  }

  async function handleMoveSample(
  storageLocationId: number,
  reason: string
) {
  if (!sample) {
    return;
  }

  const sampleId = Number(sample.id);

  if (
    !Number.isInteger(sampleId) ||
    sampleId <= 0
  ) {
    setError(
      "No se pudo identificar la muestra."
    );

    return;
  }

  if (
    !Number.isInteger(storageLocationId) ||
    storageLocationId <= 0
  ) {
    setError(
      "Selecciona una ubicación válida."
    );

    return;
  }

  if (!reason.trim()) {
    setError(
      "Debes indicar el motivo del movimiento."
    );

    return;
  }

  try {
    setIsSaving(true);
    setError(null);

    await moveSampleAction(
      sampleId,
      storageLocationId,
      reason.trim()
    );

    setIsMoving(false);

    router.refresh();
  } catch (error) {
    console.error(
      "Error moving sample:",
      error
    );

    setError(
      error instanceof Error
        ? error.message
        : "No se pudo mover la muestra."
    );
  } finally {
    setIsSaving(false);
  }
}

  // ======================================================
  // CREATION — LOCATION STEP
  // ======================================================

  if (
    isNew &&
    creationStep === "location"
  ) {
    return (
      <div className="mx-auto max-w-5xl space-y-8">
        {/* ----------------------------------------
            BACK
        ---------------------------------------- */}

        <div>
          <Link
            href="/samples"
            className="inline-flex items-center gap-2 text-sm font-bold text-secondary transition hover:text-accent"
          >
            <ArrowLeft size={18} />
            Volver a muestras
          </Link>
        </div>

        {/* ----------------------------------------
            SUCCESS
        ---------------------------------------- */}

        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <CheckCircle2 size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-black text-primary">
                Muestra registrada
              </h1>

              <p className="mt-2 text-secondary">
                La muestra fue guardada
                correctamente. Ahora selecciona
                dónde deseas almacenarla.
              </p>
            </div>
          </div>
        </section>

        {/* ----------------------------------------
            LOCATION
        ---------------------------------------- */}

        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Ubicación
          </p>

          <h2 className="mt-2 text-2xl font-black text-primary">
            Selecciona dónde almacenar la muestra
          </h2>

          <p className="mt-2 max-w-3xl text-secondary">
            OptiLab analizó la capacidad y las
            condiciones de almacenamiento para
            recomendar ubicaciones compatibles.
          </p>

          {/* ------------------------------------
              RECOMMENDATIONS
          ------------------------------------ */}

          <div className="mt-6">
            <label
              htmlFor="initial-storage-location"
              className="mb-2 block text-sm font-bold text-primary"
            >
              Ubicaciones recomendadas
            </label>

            {creationRecommendations.length >
              0 ? (
              <select
                id="initial-storage-location"
                value={
                  selectedInitialLocationId
                }
                onChange={(event) => {
                  setSelectedInitialLocationId(
                    event.target.value
                  );

                  setError(null);
                }}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-primary outline-none transition focus:border-accent"
              >
                <option value="">
                  Selecciona una ubicación
                </option>

                {creationRecommendations.map(
                  (
                    recommendation,
                    index
                  ) => {
                    const location =
                      recommendation.storageLocation;

                    return (
                      <option
                        key={
                          location.id
                        }
                        value={
                          location.id
                        }
                      >
                        {index === 0
                          ? "Recomendada · "
                          : ""}
                        {location.code} —{" "}
                        {location.name} ·
                        Score:{" "}
                        {recommendation.score.toFixed(
                          1
                        )}
                      </option>
                    );
                  }
                )}
              </select>
            ) : (
              <div className="rounded-2xl border border-border bg-white p-4 text-sm text-secondary">
                OptiLab no encontró ubicaciones
                recomendadas para esta muestra.
                Puedes dejarla sin ubicación y
                asignarla posteriormente.
              </div>
            )}

            <p className="mt-3 text-sm text-secondary">
              Las ubicaciones están ordenadas
              según su compatibilidad con las
              características y restricciones de
              la muestra.
            </p>
          </div>

          {/* ------------------------------------
              ERROR
          ------------------------------------ */}

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* ------------------------------------
              ACTIONS
          ------------------------------------ */}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                if (createdSampleId) {
                  router.push(
                    `/samples/${createdSampleId}`
                  );

                  return;
                }

                router.push(
                  "/samples"
                );
              }}
              disabled={
                isSavingLocation
              }
              className="rounded-2xl border border-border bg-white px-5 py-3 text-sm font-bold text-primary transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              Asignar después
            </button>

            <button
              type="button"
              onClick={
                handleSaveInitialLocation
              }
              disabled={
                isSavingLocation ||
                !selectedInitialLocationId
              }
              className="rounded-2xl bg-accent px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSavingLocation
                ? "Guardando..."
                : "Guardar ubicación"}
            </button>
          </div>
        </section>
      </div>
    );
  }

  // ======================================================
  // NORMAL WORKSPACE
  // ======================================================

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* ----------------------------------------
        HEADER
    ---------------------------------------- */}

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
              Registra las características de la
              muestra para que OptiLab identifique
              las ubicaciones compatibles.
            </p>
          </>
        ) : isEditing ? (
          <>
            <h1 className="mt-4 text-4xl font-black text-primary">
              Editar muestra
            </h1>

            <p className="mt-2 text-secondary">
              Actualiza la información de la muestra.
            </p>
          </>
        ) : isMoving ? (
          <>
            <h1 className="mt-4 text-4xl font-black text-primary">
              Mover muestra
            </h1>

            <p className="mt-2 text-secondary">
              Selecciona la nueva ubicación de la muestra
              e indica el motivo del movimiento.
            </p>
          </>
        ) : null}
      </div>

      {/* ----------------------------------------
        ERROR
    ---------------------------------------- */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* ----------------------------------------
        CONTENT
    ---------------------------------------- */}

      {isEditing ? (
        <SampleForm
          mode={isNew ? "create" : "edit"}
          initialData={sample}
          recommendations={recommendations}
          laboratories={laboratories}
          materialTypes={materialTypes}
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={isSaving}
        />
      ) : sample ? (
        isMoving ? (
          <SampleMoveForm
            sample={sample}
            recommendations={recommendations}
            isSaving={isSaving}
            onCancel={() => {
              setError(null);
              setIsMoving(false);
            }}
            onConfirm={handleMoveSample}
          />
        ) : (
          <SampleDetails
            sample={sample}
            onEdit={() => {
              setError(null);
              setIsEditing(true);
            }}
            onMove={() => {
              setError(null);
              setIsMoving(true);
            }}
          />
        )
      ) : null}
    </div>
  );
}