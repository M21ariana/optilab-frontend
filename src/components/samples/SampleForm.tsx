"use client";

import {
  CalendarDays,
  MapPin,
  Save,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import type {
  SampleData,
  SampleStatus,
  StorageLocationOption,
} from "./types";

const sampleTypes = [
  "Resina",
  "Polímero",
  "Reactivo",
  "Sustancia química",
];

const locations: StorageLocationOption[] = [
  {
    id: "a1",
    code: "A1",
    name: "Estantería A - Nivel superior",
    allowedTypes: ["Resina", "Polímero"],
    availableVolume: 2800,
    availableArea: 900,
    availableWeight: 3500,
    occupancy: 80,
  },
  {
    id: "a2",
    code: "A2",
    name: "Estantería A - Nivel medio",
    allowedTypes: ["Resina", "Polímero"],
    availableVolume: 6500,
    availableArea: 1800,
    availableWeight: 8000,
    occupancy: 60,
  },
  {
    id: "a3",
    code: "A3",
    name: "Estantería A - Nivel inferior",
    allowedTypes: ["Resina", "Polímero"],
    availableVolume: 9200,
    availableArea: 2900,
    availableWeight: 12000,
    occupancy: 40,
  },
  {
    id: "f1",
    code: "F1",
    name: "Nevera 1 - Bandeja superior",
    allowedTypes: ["Reactivo"],
    availableVolume: 3800,
    availableArea: 1200,
    availableWeight: 5000,
    occupancy: 80,
  },
  {
    id: "f2",
    code: "F2",
    name: "Nevera 1 - Bandeja inferior",
    allowedTypes: ["Reactivo", "Sustancia química"],
    availableVolume: 7000,
    availableArea: 2200,
    availableWeight: 9000,
    occupancy: 60,
  },
  {
    id: "g1",
    code: "G1",
    name: "Gabinete químico - Compartimiento superior",
    allowedTypes: ["Sustancia química"],
    availableVolume: 3200,
    availableArea: 1100,
    availableWeight: 4500,
    occupancy: 90,
  },
];

type SampleFormProps = {
  mode: "create" | "edit";
  initialData?: SampleData;

  onSave: (data: SampleData) => void;
  onCancel: () => void;
};

export function SampleForm({
  mode,
  initialData,
  onSave,
  onCancel,
}: SampleFormProps) {
  const isEdit = mode === "edit";

  const [name, setName] = useState(initialData?.name ?? "");
  const [code, setCode] = useState(initialData?.code ?? "");
  const [type, setType] = useState(initialData?.type ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );

  const [weight, setWeight] = useState(initialData?.weight ?? "");
  const [volume, setVolume] = useState(initialData?.volume ?? "");
  const [area, setArea] = useState(initialData?.area ?? "");

  const [entryDate, setEntryDate] = useState(
    initialData?.entryDate ?? ""
  );

  const [hasExpiration, setHasExpiration] = useState(
    Boolean(initialData?.expirationDate)
  );

  const [expirationDate, setExpirationDate] = useState(
    initialData?.expirationDate ?? ""
  );

  const [status, setStatus] = useState<SampleStatus>(
    initialData?.status ?? "ACTIVE"
  );

  const [selectedLocationId, setSelectedLocationId] = useState(
    initialData?.locationId ?? ""
  );

  const [movementReason, setMovementReason] = useState("");

  const physicalDataComplete =
    Boolean(type) &&
    Number(weight) > 0 &&
    Number(volume) > 0 &&
    Number(area) > 0;

  const eligibleLocations = useMemo(() => {
    if (!physicalDataComplete) {
      return [];
    }

    const sampleWeight = Number(weight);
    const sampleVolume = Number(volume);
    const sampleArea = Number(area);

    return locations
      .filter((location) => {
        const acceptsType =
          location.allowedTypes.includes(type);

        const supportsWeight =
          location.availableWeight >= sampleWeight;

        const supportsVolume =
          location.availableVolume >= sampleVolume;

        const supportsArea =
          location.availableArea >= sampleArea;

        return (
          acceptsType &&
          supportsWeight &&
          supportsVolume &&
          supportsArea
        );
      })
      .map((location) => {
        const volumeWaste =
          (location.availableVolume - sampleVolume) /
          location.availableVolume;

        const areaWaste =
          (location.availableArea - sampleArea) /
          location.availableArea;

        const weightWaste =
          (location.availableWeight - sampleWeight) /
          location.availableWeight;

        const fitScore =
          volumeWaste + areaWaste + weightWaste;

        return {
          ...location,
          fitScore,
        };
      })
      .sort((a, b) => a.fitScore - b.fitScore);
  }, [
    area,
    physicalDataComplete,
    type,
    volume,
    weight,
  ]);

  const selectedLocation = locations.find(
    (location) => location.id === selectedLocationId
  );

  const locationChanged =
    isEdit &&
    selectedLocationId &&
    selectedLocationId !== initialData?.locationId;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedLocation) {
      return;
    }

    if (locationChanged && !movementReason.trim()) {
      return;
    }

    const data: SampleData = {
      id: initialData?.id ?? code,

      name,
      code,
      type,
      description,

      weight,
      volume,
      area,

      entryDate,
      expirationDate: hasExpiration
        ? expirationDate
        : "",

      status,

      locationId: selectedLocation.id,
      locationCode: selectedLocation.code,
      locationName: selectedLocation.name,
    };

    onSave(data);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* GENERAL */}
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Información general
        </p>

        <h2 className="mt-2 text-xl font-black text-primary">
          Datos de la muestra
        </h2>

        <p className="mt-2 text-sm text-secondary">
          Ingresa la información necesaria para identificar y clasificar la
          muestra.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
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

          <label>
            <span className="mb-2 block text-sm font-bold text-primary">
              Tipo de muestra
            </span>

            <select
              required
              value={type}
              onChange={(event) => {
                setType(event.target.value);

                if (!isEdit) {
                  setSelectedLocationId("");
                }
              }}
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
            >
              <option value="">
                Selecciona un tipo
              </option>

              {sampleTypes.map((sampleType) => (
                <option
                  key={sampleType}
                  value={sampleType}
                >
                  {sampleType}
                </option>
              ))}
            </select>
          </label>

          {isEdit && (
            <label>
              <span className="mb-2 block text-sm font-bold text-primary">
                Estado
              </span>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as SampleStatus
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
              </select>
            </label>
          )}
        </div>

        <label className="mt-6 block">
          <span className="mb-2 block text-sm font-bold text-primary">
            Descripción
          </span>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            rows={4}
            placeholder="Describe la muestra..."
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
          />
        </label>
      </section>

      {/* PHYSICAL DATA */}
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Características físicas
        </p>

        <h2 className="mt-2 text-xl font-black text-primary">
          Espacio requerido
        </h2>

        <p className="mt-2 text-sm text-secondary">
          Estos valores permiten a OptiLab identificar qué ubicaciones tienen
          capacidad suficiente para almacenar la muestra.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <label>
            <span className="mb-2 block text-sm font-bold text-primary">
              Peso (g)
            </span>

            <input
              required
              min="0"
              type="number"
              value={weight}
              onChange={(event) => {
                setWeight(event.target.value);

                if (!isEdit) {
                  setSelectedLocationId("");
                }
              }}
              placeholder="500"
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-bold text-primary">
              Volumen (cm³)
            </span>

            <input
              required
              min="0"
              type="number"
              value={volume}
              onChange={(event) => {
                setVolume(event.target.value);

                if (!isEdit) {
                  setSelectedLocationId("");
                }
              }}
              placeholder="2500"
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-bold text-primary">
              Área ocupada (cm²)
            </span>

            <input
              required
              min="0"
              type="number"
              value={area}
              onChange={(event) => {
                setArea(event.target.value);

                if (!isEdit) {
                  setSelectedLocationId("");
                }
              }}
              placeholder="750"
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
            />
          </label>
        </div>
      </section>

      {/* DATES */}
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Fechas
        </p>

        <h2 className="mt-2 text-xl font-black text-primary">
          Vigencia
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
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
                  setEntryDate(event.target.value)
                }
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </label>

          <div>
            <label className="flex items-center gap-3 pt-1 text-sm font-bold text-primary">
              <input
                type="checkbox"
                checked={hasExpiration}
                onChange={(event) => {
                  setHasExpiration(
                    event.target.checked
                  );

                  if (!event.target.checked) {
                    setExpirationDate("");
                  }
                }}
                className="h-4 w-4 accent-[#2A9D8F]"
              />

              Esta muestra tiene fecha de vencimiento
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

      {/* LOCATION */}
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
              Selecciona dónde almacenar la muestra
            </h2>

            <p className="mt-2 text-sm text-secondary">
              OptiLab mostrará únicamente ubicaciones compatibles con el tipo,
              peso, volumen y área de esta muestra.
            </p>
          </div>
        </div>

        {isEdit && initialData?.locationId && (
          <div className="mt-6 rounded-2xl border border-border bg-background px-4 py-4">
            <p className="text-xs font-bold uppercase tracking-wide text-secondary">
              Ubicación actual
            </p>

            <p className="mt-2 font-black text-primary">
              {initialData.locationCode} —{" "}
              {initialData.locationName}
            </p>
          </div>
        )}

        <div className="mt-6">
          <label>
            <span className="mb-2 block text-sm font-bold text-primary">
              {isEdit
                ? "Ubicación"
                : "Ubicaciones compatibles"}
            </span>

            <select
              required
              disabled={!physicalDataComplete}
              value={selectedLocationId}
              onChange={(event) =>
                setSelectedLocationId(
                  event.target.value
                )
              }
              className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                physicalDataComplete
                  ? "border-border bg-white text-primary focus:border-accent"
                  : "cursor-not-allowed border-border/60 bg-muted/60 text-secondary"
              }`}
            >
              <option value="">
                {physicalDataComplete
                  ? eligibleLocations.length > 0
                    ? "Selecciona una ubicación"
                    : "No hay ubicaciones compatibles"
                  : "Completa los datos físicos primero"}
              </option>

              {eligibleLocations.map(
                (location, index) => (
                  <option
                    key={location.id}
                    value={location.id}
                  >
                    {index === 0
                      ? "Recomendada · "
                      : ""}
                    {location.code} —{" "}
                    {location.name} ·{" "}
                    {location.occupancy}% ocupada
                  </option>
                )
              )}
            </select>
          </label>

          {physicalDataComplete &&
            eligibleLocations.length > 0 && (
              <p className="mt-3 text-xs text-secondary">
                Las opciones están ordenadas según el aprovechamiento estimado
                del espacio disponible.
              </p>
            )}

          {physicalDataComplete &&
            eligibleLocations.length === 0 && (
              <div className="mt-4 rounded-2xl bg-warning/10 px-4 py-3 text-sm text-warning">
                No encontramos una ubicación compatible con las características
                actuales de la muestra.
              </div>
            )}
        </div>

        {/* Movement reason */}
        {locationChanged && (
          <div className="mt-6 border-t border-border pt-6">
            <label>
              <span className="mb-2 block text-sm font-bold text-primary">
                Motivo del traslado
              </span>

              <textarea
                required
                value={movementReason}
                onChange={(event) =>
                  setMovementReason(
                    event.target.value
                  )
                }
                rows={3}
                placeholder="Ej. Reorganización del inventario para optimizar el espacio."
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
              />
            </label>

            <p className="mt-2 text-xs text-secondary">
              Este cambio será registrado en el historial de movimientos de la
              muestra.
            </p>
          </div>
        )}
      </section>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-border bg-white px-5 py-3 text-sm font-bold text-primary transition hover:border-accent"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="flex items-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-accent/20 transition hover:opacity-90"
        >
          <Save size={18} />

          {isEdit
            ? "Guardar cambios"
            : "Registrar muestra"}
        </button>
      </div>
    </form>
  );
}