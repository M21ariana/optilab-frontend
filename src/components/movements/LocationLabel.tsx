import { MapPin } from "lucide-react";

type LocationLabelProps = {
  code: string;
  name: string;
};

export function LocationLabel({
  code,
  name,
}: LocationLabelProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2">
      <MapPin size={15} className="text-accent" />

      <div>
        <span className="font-black text-primary">
          {code}
        </span>

        <span className="ml-2 text-secondary">
          {name}
        </span>
      </div>
    </div>
  );
}