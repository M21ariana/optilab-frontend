import { ReactNode } from "react";

type ReadOnlyFieldProps = {
  label: string;
  value: string;
  icon: ReactNode;
};

export function ReadOnlyField({
  label,
  value,
  icon,
}: ReadOnlyFieldProps) {
  return (
    <div>
      <span className="mb-2 block text-sm font-bold text-primary">
        {label}
      </span>

      <div
        title="Este campo no se puede editar"
        className="flex cursor-not-allowed items-center gap-3 rounded-2xl border border-border/70 bg-muted/60 px-4 py-3 text-secondary transition hover:bg-muted/80"
      >
        <div className="shrink-0 text-secondary/60">
          {icon}
        </div>

        <span className="text-sm font-medium text-secondary/80">
          {value}
        </span>
      </div>
    </div>
  );
}