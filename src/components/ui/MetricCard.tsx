type MetricCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle?: string;
  variant?: "default" | "warning" | "danger";
  compact?: boolean;
};

export function MetricCard({
  title,
  value,
  icon,
  subtitle,
  variant = "default",
  compact = false,
}: MetricCardProps) {
  const iconStyles = {
    default: "bg-accent/10 text-accent",
    warning: "bg-warning/15 text-warning",
    danger: "bg-danger/10 text-danger",
  };

  return (
    <div
      className={`rounded-3xl border border-border bg-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        compact ? "p-4" : "p-6"
      }`}
    >
      <div
        className={`flex items-center justify-center rounded-2xl ${
          compact ? "h-10 w-10" : "h-12 w-12"
        } ${iconStyles[variant]}`}
      >
        {icon}
      </div>

      <p
        className={`font-bold text-secondary ${
          compact ? "mt-3 text-xs" : "mt-5 text-sm"
        }`}
      >
        {title}
      </p>

      <p
        className={`font-black text-primary ${
          compact ? "mt-1 text-2xl" : "mt-2 text-4xl"
        }`}
      >
        {value}
      </p>

      {subtitle && (
        <p
          className={`text-secondary ${
            compact ? "mt-1 text-xs" : "mt-4 text-sm"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}