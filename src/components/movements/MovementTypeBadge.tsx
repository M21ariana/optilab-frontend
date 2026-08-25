import type { Movement } from "./types";
export function MovementTypeBadge({
  type,
}: {
  type: Movement["type"];
}) {
  const styles = {
    ENTRY: {
      label: "Entrada",
      className: "bg-accent/10 text-accent",
    },
    TRANSFER: {
      label: "Traslado",
      className: "bg-warning/15 text-warning",
    },
    EXIT: {
      label: "Salida",
      className: "bg-danger/10 text-danger",
    },
  };

  const config = styles[type];

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-extrabold ${config.className}`}
    >
      {config.label}
    </span>
  );
}