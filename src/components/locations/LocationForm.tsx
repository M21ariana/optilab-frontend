import Link from "next/link";
import { Save } from "lucide-react";

type LocationFormProps = {
  mode: "create" | "edit";
  initialData?: {
    name?: string;
    code?: string;
    type?: string;
    description?: string;
    maxVolume?: string;
    maxArea?: string;
    maxWeight?: string;
    allowedTypes?: string[];
  };
};

export function LocationForm({
  mode,
  initialData,
}: LocationFormProps) {
  const isEdit = mode === "edit";

  return (
    <form className="rounded-3xl border border-border bg-surface p-8 shadow-sm">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          label="Nombre de la ubicación"
          placeholder="Estantería A - Nivel superior"
          defaultValue={initialData?.name}
        />

        <Input
          label="Código"
          placeholder="A1"
          defaultValue={initialData?.code}
        />

        <Select
          label="Tipo de ubicación"
          defaultValue={initialData?.type}
          options={[
            "Estantería",
            "Refrigerado",
            "Gabinete",
            "Congelador",
            "Caja",
            "Otro",
          ]}
        />

        <Input
          label="Volumen máximo (cm³)"
          placeholder="20000"
          defaultValue={initialData?.maxVolume}
          type="number"
        />

        <Input
          label="Área máxima (cm²)"
          placeholder="5000"
          defaultValue={initialData?.maxArea}
          type="number"
        />

        <Input
          label="Peso máximo (g)"
          placeholder="15000"
          defaultValue={initialData?.maxWeight}
          type="number"
        />
      </div>

      <label className="mt-6 block">
        <span className="mb-2 block text-sm font-bold text-primary">
          Tipos de muestra permitidos
        </span>

        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-white p-4 md:grid-cols-2">
          {[
            "Resina",
            "Polímero",
            "Reactivo",
            "Sustancia química",
          ].map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 rounded-xl border border-border px-4 py-3"
            >
              <input
                type="checkbox"
                defaultChecked={initialData?.allowedTypes?.includes(type)}
                className="h-4 w-4 accent-[#2A9D8F]"
              />

              <span className="text-sm font-medium text-primary">
                {type}
              </span>
            </label>
          ))}
        </div>
      </label>

      <label className="mt-6 block">
        <span className="mb-2 block text-sm font-bold text-primary">
          Descripción
        </span>

        <textarea
          rows={5}
          defaultValue={initialData?.description}
          placeholder="Describe el propósito de esta ubicación y las condiciones de almacenamiento..."
          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-secondary/50 focus:border-accent"
        />
      </label>

      <div className="mt-8 flex justify-end gap-3">
        <Link
          href="/locations"
          className="rounded-2xl border border-border bg-white px-5 py-3 text-sm font-bold text-primary transition hover:border-accent"
        >
          Cancelar
        </Link>

        <button
          type="button"
          className="flex items-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-accent/20 transition hover:opacity-90"
        >
          <Save size={18} />
          {isEdit ? "Guardar cambios" : "Guardar ubicación"}
        </button>
      </div>
    </form>
  );
}

function Input({
  label,
  placeholder,
  defaultValue,
  type = "text",
}: {
  label: string;
  placeholder: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-primary">
        {label}
      </span>

      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-secondary/50 focus:border-accent"
      />
    </label>
  );
}

function Select({
  label,
  options,
  defaultValue,
}: {
  label: string;
  options: string[];
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-primary">
        {label}
      </span>

      <select
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
      >
        <option value="" disabled>
          Selecciona una opción
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}