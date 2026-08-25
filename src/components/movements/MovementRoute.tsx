import { ArrowRight } from "lucide-react";
import { LocationLabel } from "./LocationLabel";
import type { Movement } from "./types";

type MovementRouteProps = {
  movement: Movement;
};

export function MovementRoute({
  movement,
}: MovementRouteProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
      {movement.fromLocation ? (
        <LocationLabel
          code={movement.fromLocation}
          name={movement.fromLocationName ?? ""}
        />
      ) : (
        <span className="rounded-xl bg-muted px-3 py-2 font-bold text-secondary">
          Fuera del inventario
        </span>
      )}

      <ArrowRight
        size={17}
        className="shrink-0 text-secondary"
      />

      {movement.toLocation ? (
        <LocationLabel
          code={movement.toLocation}
          name={movement.toLocationName ?? ""}
        />
      ) : (
        <span className="rounded-xl bg-muted px-3 py-2 font-bold text-secondary">
          Fuera del inventario
        </span>
      )}
    </div>
  );
}