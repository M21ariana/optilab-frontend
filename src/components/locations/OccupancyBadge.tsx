export function OccupancyBadge({ occupancy }: { occupancy: number }) {
  const style =
    occupancy >= 86
      ? "bg-danger/10 text-danger"
      : occupancy >= 61
        ? "bg-warning/15 text-warning"
        : "bg-accent/10 text-accent";

  const label =
    occupancy >= 86
      ? "Capacidad alta"
      : occupancy >= 61
        ? "Ocupación media"
        : "Disponible";

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${style}`}
    >
      {occupancy}% · {label}
    </span>
  );
}