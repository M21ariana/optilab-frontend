type SummaryItemProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

export function SummaryItem({
  label,
  value,
  icon,
}: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-white px-4 py-4 transition hover:border-accent/40">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
          {icon}
        </div>

        <p className="font-medium text-primary">
          {label}
        </p>
      </div>

      <p className="text-lg font-black text-primary">
        {value}
      </p>
    </div>
  );
}