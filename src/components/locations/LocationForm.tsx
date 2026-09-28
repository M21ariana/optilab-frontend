"use client";

import Link from "next/link";

import {
  Save,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  FormEvent,
  useState,
} from "react";

import {
  createStorageLocation,
  updateStorageLocation,
} from "@/app/locations/actions";

// ----------------------------------------
// TYPES
// ----------------------------------------

type LaboratoryOption = {
  id: string;
  name: string;
};

export type LocationFormData = {
  id?: string;

  laboratoryId?: number;

  name?: string;
  code?: string;
  type?: string;
  description?: string;

  maxVolumeCm3?: number | null;
  maxAreaCm2?: number | null;
  maxWeightG?: number | null;

  supportsColdStorage?: boolean;
  supportsLightProtection?: boolean;
  supportsHazardous?: boolean;
};

type LocationFormProps = {
  mode: "create" | "edit";

  laboratories: LaboratoryOption[];

  initialData?: LocationFormData;
};

// ----------------------------------------
// COMPONENT
// ----------------------------------------

export function LocationForm({
  mode,
  laboratories = [],
  initialData,
}: LocationFormProps) {
  const router =
    useRouter();

  const isEdit =
    mode === "edit";

  const [
    supportsColdStorage,
    setSupportsColdStorage,
  ] = useState(
    initialData?.supportsColdStorage ?? false
  );

  const [
    supportsLightProtection,
    setSupportsLightProtection,
  ] = useState(
    initialData?.supportsLightProtection ?? false
  );

  const [
    supportsHazardous,
    setSupportsHazardous,
  ] = useState(
    initialData?.supportsHazardous ?? false
  );

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  // ----------------------------------------
  // SUBMIT
  // ----------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      const formData =
        new FormData(
          event.currentTarget
        );

      const laboratoryId =
        Number(
          formData.get(
            "laboratoryId"
          )
        );

      const name =
        String(
          formData.get("name") ?? ""
        ).trim();

      const code =
        String(
          formData.get("code") ?? ""
        ).trim();

      const type =
        String(
          formData.get("type") ?? ""
        ).trim();

      const description =
        String(
          formData.get(
            "description"
          ) ?? ""
        ).trim();

      const maxVolumeCm3 =
        optionalNumber(
          formData.get(
            "maxVolumeCm3"
          )
        );

      const maxAreaCm2 =
        optionalNumber(
          formData.get(
            "maxAreaCm2"
          )
        );

      const maxWeightG =
        optionalNumber(
          formData.get(
            "maxWeightG"
          )
        );

      // ----------------------------------------
      // BASIC VALIDATION
      // ----------------------------------------

      if (
        !laboratoryId ||
        !name ||
        !code ||
        !type
      ) {
        throw new Error(
          "Completa todos los campos obligatorios."
        );
      }

      if (
        maxVolumeCm3 !== undefined &&
        maxVolumeCm3 <= 0
      ) {
        throw new Error(
          "El volumen máximo debe ser mayor que 0."
        );
      }

      if (
        maxAreaCm2 !== undefined &&
        maxAreaCm2 <= 0
      ) {
        throw new Error(
          "El área máxima debe ser mayor que 0."
        );
      }

      if (
        maxWeightG !== undefined &&
        maxWeightG <= 0
      ) {
        throw new Error(
          "El peso máximo debe ser mayor que 0."
        );
      }

      const data = {
        laboratoryId,

        name,
        code,
        type,

        ...(description
          ? {
            description,
          }
          : {}),

        ...(maxVolumeCm3 !==
          undefined
          ? {
            maxVolumeCm3,
          }
          : {}),

        ...(maxAreaCm2 !==
          undefined
          ? {
            maxAreaCm2,
          }
          : {}),

        ...(maxWeightG !==
          undefined
          ? {
            maxWeightG,
          }
          : {}),

        supportsColdStorage:
          formData.get(
            "supportsColdStorage"
          ) === "on",

        supportsLightProtection:
          formData.get(
            "supportsLightProtection"
          ) === "on",

        supportsHazardous:
          formData.get(
            "supportsHazardous"
          ) === "on",
      };

      // ----------------------------------------
      // CREATE / UPDATE
      // ----------------------------------------

      let locationId: string;

      if (isEdit) {
        if (!initialData?.id) {
          throw new Error(
            "Missing storage location ID."
          );
        }

        const result =
          await updateStorageLocation(
            Number(initialData.id),
            data
          );

        locationId =
          result.id;
      } else {
        const result =
          await createStorageLocation(
            data
          );

        locationId =
          result.id;
      }

      // ----------------------------------------
      // REDIRECT
      // ----------------------------------------

      router.push(
        `/locations/${locationId}`
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado."
      );

      setIsSubmitting(false);
    }
  }

  // ----------------------------------------
  // RENDER
  // ----------------------------------------

  return (
    <form
      key={
        isEdit
          ? `location-${initialData?.id}`
          : "new-location"
      }
      onSubmit={handleSubmit}
      className="rounded-3xl border border-border bg-surface p-8 shadow-sm"
    >
      {/* General */}

      <div>
        <h2 className="text-xl font-black text-primary">
          Información general
        </h2>

        <p className="mt-2 text-sm text-secondary">
          Define la identificación y el
          laboratorio al que pertenece esta
          ubicación.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Select
          name="laboratoryId"
          label="Laboratorio"
          defaultValue={
            initialData?.laboratoryId
              ? String(
                initialData.laboratoryId
              )
              : ""
          }
          options={laboratories.map(
            (laboratory) => ({
              value: laboratory.id,
              label: laboratory.name,
            })
          )}
          required
        />

        <Input
          name="name"
          label="Nombre de la ubicación"
          placeholder="Estantería A - Nivel superior"
          defaultValue={
            initialData?.name
          }
          required
        />

        <Input
          name="code"
          label="Código"
          placeholder="A1"
          defaultValue={
            initialData?.code
          }
          required
        />

        <Select
          name="type"
          label="Tipo de ubicación"
          defaultValue={
            initialData?.type
          }
          options={[
            {
              value: "Estantería",
              label: "Estantería",
            },
            {
              value: "Refrigerado",
              label: "Refrigerado",
            },
            {
              value: "Gabinete",
              label: "Gabinete",
            },
            {
              value: "Congelador",
              label: "Congelador",
            },
            {
              value: "Caja",
              label: "Caja",
            },
            {
              value: "Otro",
              label: "Otro",
            },
          ]}
          required
        />
      </div>

      <label className="mt-6 block">
        <span className="mb-2 block text-sm font-bold text-primary">
          Descripción
        </span>

        <textarea
          name="description"
          rows={4}
          defaultValue={
            initialData?.description
          }
          placeholder="Describe el propósito de esta ubicación..."
          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-secondary/50 focus:border-accent"
        />
      </label>

      {/* Capacity */}

      <div className="mt-8 border-t border-border pt-8">
        <h2 className="text-xl font-black text-primary">
          Capacidad
        </h2>

        <p className="mt-2 text-sm text-secondary">
          Define los límites físicos de la
          ubicación.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Input
            name="maxAreaCm2"
            label="Área máxima (cm²)"
            placeholder="5000"
            defaultValue={
              initialData
                ?.maxAreaCm2 ??
              undefined
            }
            type="number"
            step="0.01"
          />

          <Input
            name="maxVolumeCm3"
            label="Volumen máximo (cm³)"
            placeholder="20000"
            defaultValue={
              initialData
                ?.maxVolumeCm3 ??
              undefined
            }
            type="number"
            step="0.01"
          />

          <Input
            name="maxWeightG"
            label="Peso máximo (g)"
            placeholder="15000"
            defaultValue={
              initialData
                ?.maxWeightG ??
              undefined
            }
            type="number"
            step="0.01"
          />
        </div>
      </div>

      {/* Conditions */}

      <div className="mt-8 border-t border-border pt-8">
        <h2 className="text-xl font-black text-primary">
          Condiciones de almacenamiento
        </h2>

        <p className="mt-2 text-sm text-secondary">
          Indica qué condiciones especiales
          soporta esta ubicación.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          <Checkbox
            name="supportsColdStorage"
            label="Refrigeración"
            description="Permite almacenar muestras que requieren frío."
            checked={supportsColdStorage}
            onChange={setSupportsColdStorage}
          />

          <Checkbox
            name="supportsLightProtection"
            label="Protección contra luz"
            description="Protege materiales sensibles a la exposición lumínica."
            checked={supportsLightProtection}
            onChange={setSupportsLightProtection}
          />

          <Checkbox
            name="supportsHazardous"
            label="Materiales peligrosos"
            description="Permite almacenar muestras clasificadas como peligrosas."
            checked={supportsHazardous}
            onChange={setSupportsHazardous}
          />
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}

      <div className="mt-8 flex justify-end gap-3">
        <Link
          href={
            isEdit &&
              initialData?.id
              ? `/locations/${initialData.id}`
              : "/locations"
          }
          className="rounded-2xl border border-border bg-white px-5 py-3 text-sm font-bold text-primary transition hover:border-accent"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-accent/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={18} />

          {isSubmitting
            ? "Guardando..."
            : isEdit
              ? "Guardar cambios"
              : "Guardar ubicación"}
        </button>
      </div>
    </form>
  );
}

// ----------------------------------------
// INPUT
// ----------------------------------------

function Input({
  name,
  label,
  placeholder,
  defaultValue,
  type = "text",
  step,
  required = false,
}: {
  name: string;
  label: string;
  placeholder: string;
  defaultValue?:
  | string
  | number;
  type?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-primary">
        {label}
      </span>

      <input
        name={name}
        type={type}
        step={step}
        min={
          type === "number"
            ? "0"
            : undefined
        }
        required={required}
        defaultValue={
          defaultValue
        }
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-secondary/50 focus:border-accent"
      />
    </label>
  );
}

// ----------------------------------------
// SELECT
// ----------------------------------------

function Select({
  name,
  label,
  options,
  defaultValue,
  required = false,
}: {
  name: string;
  label: string;

  options: {
    value: string;
    label: string;
  }[];

  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-primary">
        {label}
      </span>

      <select
        name={name}
        required={required}
        defaultValue={
          defaultValue ?? ""
        }
        className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
      >
        <option
          value=""
          disabled
        >
          Selecciona una opción
        </option>

        {options.map(
          (option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          )
        )}
      </select>
    </label>
  );
}

// ----------------------------------------
// CHECKBOX
// ----------------------------------------

function Checkbox({
  name,
  label,
  description,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer gap-3 rounded-2xl border border-border bg-white p-4 transition hover:border-accent/50">
      <input
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="mt-1 h-4 w-4 shrink-0 accent-[#2A9D8F]"
      />

      <span>
        <span className="block text-sm font-bold text-primary">
          {label}
        </span>

        <span className="mt-1 block text-xs leading-5 text-secondary">
          {description}
        </span>
      </span>
    </label>
  );
}

// ----------------------------------------
// HELPERS
// ----------------------------------------

function optionalNumber(
  value: FormDataEntryValue | null
) {
  if (
    value === null ||
    value === ""
  ) {
    return undefined;
  }

  const parsed =
    Number(value);

  if (
    Number.isNaN(parsed)
  ) {
    return undefined;
  }

  return parsed;
}