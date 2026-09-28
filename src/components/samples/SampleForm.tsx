"use client";

import {
  CalendarDays,
  MapPin,
  Save,
} from "lucide-react";

import {
  type FormEvent,
  useState,
} from "react";

import type {
  SampleData,
  SampleStatus,
} from "./types";

import type {
  StorageRecommendation,
} from "@/lib/graphql/samples";

import type {
  LaboratoryOption,
  MaterialTypeOption,
} from "@/lib/graphql/sampleOptions";

type SampleFormProps = {
  mode: "create" | "edit";

  initialData?: SampleData;

  recommendations?: StorageRecommendation[];

  laboratories?: LaboratoryOption[];

  materialTypes?: MaterialTypeOption[];

  isSaving?: boolean;

  onSave: (
    data: SampleData
  ) => void | Promise<void>;

  onCancel: () => void;
};

export function SampleForm({
  mode,
  initialData,
  recommendations = [],
  laboratories = [],
  materialTypes = [],
  isSaving = false,
  onSave,
  onCancel,
}: SampleFormProps) {
  const isEdit = mode === "edit";

  // ----------------------------------------
  // GENERAL DATA
  // ----------------------------------------

  const [name, setName] = useState(
    initialData?.name ?? ""
  );

  const [code, setCode] = useState(
    initialData?.code ?? ""
  );

  const [
    description,
    setDescription,
  ] = useState(
    initialData?.description ?? ""
  );

  // ----------------------------------------
  // LABORATORY / MATERIAL TYPE
  // ----------------------------------------

  const [
    laboratoryId,
    setLaboratoryId,
  ] = useState(
    initialData?.laboratoryId
      ? String(initialData.laboratoryId)
      : ""
  );

  const [
    materialTypeId,
    setMaterialTypeId,
  ] = useState(
    initialData?.materialTypeId
      ? String(initialData.materialTypeId)
      : ""
  );

  const selectedMaterialType =
    materialTypes.find(
      (materialType) =>
        String(materialType.id) ===
        materialTypeId
    );

  const type =
    selectedMaterialType?.name ??
    initialData?.type ??
    "";

  // ----------------------------------------
  // PHYSICAL DATA
  // ----------------------------------------

  const [weight, setWeight] = useState(
    initialData?.weight ?? ""
  );

  const [volume, setVolume] = useState(
    initialData?.volume ?? ""
  );

  const [area, setArea] = useState(
    initialData?.area ?? ""
  );

  // ----------------------------------------
  // DATES
  // ----------------------------------------

  const [
    entryDate,
    setEntryDate,
  ] = useState(
    initialData?.entryDate ?? ""
  );

  const [
    hasExpiration,
    setHasExpiration,
  ] = useState(
    Boolean(initialData?.expirationDate)
  );

  const [
    expirationDate,
    setExpirationDate,
  ] = useState(
    initialData?.expirationDate ?? ""
  );

  // ----------------------------------------
  // STATUS
  // ----------------------------------------

  const [status, setStatus] =
    useState<SampleStatus>(
      initialData?.status ?? "ACTIVE"
    );

  // ----------------------------------------
  // LOCATION
  // ----------------------------------------

  const [
    selectedLocationId,
    setSelectedLocationId,
  ] = useState(
    initialData?.locationId ?? ""
  );

  const selectedRecommendation =
    recommendations.find(
      (recommendation) =>
        String(
          recommendation.storageLocation.id
        ) === selectedLocationId
    );

  const selectedLocation =
    selectedRecommendation?.storageLocation;

  // ----------------------------------------
  // SUBMIT
  // ----------------------------------------

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    // ----------------------------------------
    // BASIC VALIDATION
    // ----------------------------------------

    if (!laboratoryId) {
      return;
    }

    if (!materialTypeId) {
      return;
    }

    // ----------------------------------------
    // LOCATION VALIDATION
    // ----------------------------------------

    /**
     * During CREATE we do NOT assign a
     * storage location yet.
     *
     * First the sample must be created.
     * Afterwards the backend can calculate
     * storage recommendations using its ID.
     *
     * During EDIT:
     * - If the sample already has a location,
     *   that location cannot be changed here.
     * - If the sample has no location yet,
     *   the user must select one.
     */

    if (
      isEdit &&
      !initialData?.locationId &&
      !selectedLocationId
    ) {
      return;
    }

    // ----------------------------------------
    // BUILD SAMPLE DATA
    // ----------------------------------------

    const data: SampleData = {
      // ----------------------------------------
      // IDENTIFIERS
      // ----------------------------------------

      id: initialData?.id,

      laboratoryId:
        Number(laboratoryId),

      materialTypeId:
        Number(materialTypeId),

      // ----------------------------------------
      // GENERAL DATA
      // ----------------------------------------

      name,

      code,

      type,

      description,

      status,

      // ----------------------------------------
      // PHYSICAL DATA
      // ----------------------------------------

      weight,

      volume,

      area,

      // ----------------------------------------
      // DATES
      // ----------------------------------------

      entryDate,

      expirationDate:
        hasExpiration
          ? expirationDate
          : "",

      // ----------------------------------------
      // STORAGE REQUIREMENTS
      // ----------------------------------------

      isStackable:
        initialData?.isStackable ??
        false,

      maxStackUnits:
        initialData?.maxStackUnits ??
        null,

      requiresColdStorage:
        initialData
          ?.requiresColdStorage ??
        false,

      requiresLightProtection:
        initialData
          ?.requiresLightProtection ??
        false,

      isHazardous:
        initialData?.isHazardous ??
        false,

      // ----------------------------------------
      // LOCATION
      // ----------------------------------------

      locationId: isEdit
        ? initialData?.locationId ||
        selectedLocationId
        : "",

      locationCode: isEdit
        ? initialData?.locationId
          ? initialData.locationCode
          : selectedLocation?.code ?? ""
        : "",

      locationName: isEdit
        ? initialData?.locationId
          ? initialData.locationName
          : selectedLocation?.name ?? ""
        : "",
    };

    // ----------------------------------------
    // SAVE
    // ----------------------------------------

    void onSave(data);
  }

  // ----------------------------------------
  // RENDER
  // ----------------------------------------

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* ========================================
          GENERAL
      ======================================== */}

      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Información general
        </p>

        <h2 className="mt-2 text-xl font-black text-primary">
          Datos de la muestra
        </h2>

        <p className="mt-2 text-sm text-secondary">
          Ingresa la información necesaria
          para identificar y clasificar la
          muestra.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* NAME */}

          <label>
            <span className="mb-2 block text-sm font-bold text-primary">
              Nombre
            </span>

            <input
              required
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Muestra Resina A"
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
            />
          </label>

          {/* CODE */}

          <label>
            <span className="mb-2 block text-sm font-bold text-primary">
              Código
            </span>

            <input
              required
              value={code}
              onChange={(event) =>
                setCode(event.target.value)
              }
              placeholder="RES-001"
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
            />
          </label>

          {/* LABORATORY */}

          {!isEdit && (
            <label>
              <span className="mb-2 block text-sm font-bold text-primary">
                Laboratorio
              </span>

              <select
                required
                value={laboratoryId}
                onChange={(event) =>
                  setLaboratoryId(
                    event.target.value
                  )
                }
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
              >
                <option value="">
                  Selecciona un laboratorio
                </option>

                {laboratories.map(
                  (laboratory) => (
                    <option
                      key={laboratory.id}
                      value={String(
                        laboratory.id
                      )}
                    >
                      {laboratory.name}
                    </option>
                  )
                )}
              </select>
            </label>
          )}

          {/* MATERIAL TYPE */}

          <label>
            <span className="mb-2 block text-sm font-bold text-primary">
              Tipo de muestra
            </span>

            <select
              required
              value={materialTypeId}
              onChange={(event) =>
                setMaterialTypeId(
                  event.target.value
                )
              }
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
            >
              <option value="">
                Selecciona un tipo
              </option>

              {materialTypes.map(
                (materialType) => (
                  <option
                    key={materialType.id}
                    value={String(
                      materialType.id
                    )}
                  >
                    {materialType.name}
                  </option>
                )
              )}
            </select>
          </label>

          {/* STATUS */}

          {isEdit && (
            <label>
              <span className="mb-2 block text-sm font-bold text-primary">
                Estado
              </span>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target
                      .value as SampleStatus
                  )
                }
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
              >
                <option value="ACTIVE">
                  Activa
                </option>

                <option value="ARCHIVED">
                  Archivada
                </option>

                <option value="DISCARDED">
                  Descartada
                </option>

                <option value="EXPIRED">
                  Vencida
                </option>
              </select>
            </label>
          )}
        </div>

        {/* DESCRIPTION */}

        <label className="mt-6 block">
          <span className="mb-2 block text-sm font-bold text-primary">
            Descripción
          </span>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            rows={4}
            placeholder="Describe la muestra..."
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
          />
        </label>
      </section>

      {/* ========================================
          PHYSICAL DATA
      ======================================== */}

      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Características físicas
        </p>

        <h2 className="mt-2 text-xl font-black text-primary">
          Espacio requerido
        </h2>

        <p className="mt-2 text-sm text-secondary">
          Estos valores permiten a OptiLab
          identificar qué ubicaciones tienen
          capacidad suficiente para almacenar
          la muestra.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* WEIGHT */}

          <label>
            <span className="mb-2 block text-sm font-bold text-primary">
              Peso (g)
            </span>

            <input
              required
              min="0"
              step="any"
              type="number"
              value={weight}
              onChange={(event) =>
                setWeight(
                  event.target.value
                )
              }
              placeholder="500"
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
            />
          </label>

          {/* VOLUME */}

          <label>
            <span className="mb-2 block text-sm font-bold text-primary">
              Volumen (cm³)
            </span>

            <input
              required
              min="0"
              step="any"
              type="number"
              value={volume}
              onChange={(event) =>
                setVolume(
                  event.target.value
                )
              }
              placeholder="2500"
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
            />
          </label>

          {/* AREA */}

          <label>
            <span className="mb-2 block text-sm font-bold text-primary">
              Área ocupada (cm²)
            </span>

            <input
              required
              min="0"
              step="any"
              type="number"
              value={area}
              onChange={(event) =>
                setArea(event.target.value)
              }
              placeholder="750"
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
            />
          </label>
        </div>
      </section>

      {/* ========================================
          DATES
      ======================================== */}

      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Fechas
        </p>

        <h2 className="mt-2 text-xl font-black text-primary">
          Vigencia
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* ENTRY DATE */}

          <label>
            <span className="mb-2 block text-sm font-bold text-primary">
              Fecha de ingreso
            </span>

            <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3">
              <CalendarDays
                size={18}
                className="text-accent"
              />

              <input
                required
                type="date"
                value={entryDate}
                onChange={(event) =>
                  setEntryDate(
                    event.target.value
                  )
                }
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </label>

          {/* EXPIRATION */}

          <div>
            <label className="flex items-center gap-3 pt-1 text-sm font-bold text-primary">
              <input
                type="checkbox"
                checked={hasExpiration}
                onChange={(event) => {
                  setHasExpiration(
                    event.target.checked
                  );

                  if (
                    !event.target.checked
                  ) {
                    setExpirationDate("");
                  }
                }}
                className="h-4 w-4 accent-[#2A9D8F]"
              />

              Esta muestra tiene fecha de
              vencimiento
            </label>

            {hasExpiration && (
              <div className="mt-4">
                <input
                  required
                  type="date"
                  value={expirationDate}
                  onChange={(event) =>
                    setExpirationDate(
                      event.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================
          LOCATION / RECOMMENDATIONS

          This section is shown only after the
          sample exists in the backend.
      ======================================== */}

      {isEdit && (
        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <MapPin size={20} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Ubicación
              </p>

              <h2 className="mt-2 text-xl font-black text-primary">
                {initialData?.locationId
                  ? "Ubicación actual"
                  : "Selecciona dónde almacenar la muestra"}
              </h2>

              <p className="mt-2 text-sm text-secondary">
                {initialData?.locationId
                  ? "La ubicación de una muestra se administra mediante sus movimientos."
                  : "OptiLab analiza la capacidad y las condiciones de almacenamiento para recomendar ubicaciones compatibles."}
              </p>
            </div>
          </div>

          {initialData?.locationId ? (
            <div className="mt-6 rounded-2xl border border-border bg-background px-4 py-4">
              <p className="text-xs font-bold uppercase tracking-wide text-secondary">
                Ubicación actual
              </p>

              <p className="mt-2 font-black text-primary">
                {initialData.locationCode} —{" "}
                {initialData.locationName}
              </p>

              <p className="mt-2 text-xs text-secondary">
                Para cambiar esta ubicación utiliza la
                opción de mover muestra.
              </p>
            </div>
          ) : (
            <div className="mt-6">
              <label>
                <span className="mb-2 block text-sm font-bold text-primary">
                  Ubicaciones recomendadas
                </span>

                <select
                  required
                  value={selectedLocationId}
                  onChange={(event) =>
                    setSelectedLocationId(
                      event.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-primary outline-none transition focus:border-accent"
                >
                  <option value="">
                    {recommendations.length > 0
                      ? "Selecciona una ubicación"
                      : "No hay ubicaciones compatibles"}
                  </option>

                  {recommendations.map(
                    (recommendation, index) => {
                      const location =
                        recommendation.storageLocation;

                      return (
                        <option
                          key={location.id}
                          value={String(location.id)}
                        >
                          {index === 0
                            ? "Recomendada · "
                            : ""}
                          {location.code} —{" "}
                          {location.name}
                          {" · "}
                          Score:{" "}
                          {recommendation.score.toFixed(
                            1
                          )}
                        </option>
                      );
                    }
                  )}
                </select>
              </label>

              {recommendations.length > 0 && (
                <p className="mt-3 text-xs text-secondary">
                  Las ubicaciones están ordenadas según
                  su compatibilidad con las
                  características y restricciones de la
                  muestra.
                </p>
              )}

              {recommendations.length === 0 && (
                <div className="mt-4 rounded-2xl bg-warning/10 px-4 py-3 text-sm text-warning">
                  No encontramos una ubicación
                  compatible con las características
                  actuales de la muestra.
                </div>
              )}

              {selectedRecommendation && (
                <div className="mt-5 rounded-2xl border border-accent/20 bg-accent/5 p-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-accent">
                        Ubicación seleccionada
                      </p>

                      <p className="mt-1 font-black text-primary">
                        {
                          selectedRecommendation
                            .storageLocation.code
                        }{" "}
                        —{" "}
                        {
                          selectedRecommendation
                            .storageLocation.name
                        }
                      </p>
                    </div>

                    <p className="text-sm font-bold text-accent">
                      Score{" "}
                      {selectedRecommendation.score.toFixed(
                        1
                      )}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-secondary">
                        Peso disponible
                      </p>

                      <p className="mt-1 font-bold text-primary">
                        {selectedRecommendation
                          .availableWeightG ?? "—"}{" "}
                        g
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-secondary">
                        Volumen disponible
                      </p>

                      <p className="mt-1 font-bold text-primary">
                        {selectedRecommendation
                          .availableVolumeCm3 ?? "—"}{" "}
                        cm³
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-secondary">
                        Área disponible
                      </p>

                      <p className="mt-1 font-bold text-primary">
                        {selectedRecommendation
                          .availableAreaCm2 ?? "—"}{" "}
                        cm²
                      </p>
                    </div>
                  </div>

                  {selectedRecommendation.reasons.length >
                    0 && (
                      <div className="mt-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-secondary">
                          Motivos de la recomendación
                        </p>

                        <ul className="mt-2 space-y-1 text-sm text-secondary">
                          {selectedRecommendation.reasons.map(
                            (reason, index) => (
                              <li
                                key={`${reason}-${index}`}
                              >
                                • {reason}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ========================================
          ACTIONS
      ======================================== */}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-2xl border border-border bg-white px-5 py-3 text-sm font-bold text-primary transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-accent/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={18} />

          {isSaving
            ? isEdit
              ? "Guardando..."
              : "Registrando..."
            : isEdit
              ? initialData?.locationId
                ? "Guardar cambios"
                : "Guardar ubicación"
              : "Registrar muestra"}
        </button>
      </div>
    </form>
  );
}