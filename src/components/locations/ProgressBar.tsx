export function ProgressBar({ occupancy }: { occupancy: number }) {
  const barColor =
    occupancy >= 86
      ? "bg-danger"
      : occupancy >= 61
        ? "bg-warning"
        : "bg-accent";

  return (
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
      <div
        className={`h-full rounded-full ${barColor}`}
        style={{ width: `${Math.min(occupancy, 100)}%` }}
      />
    </div>
  );
}