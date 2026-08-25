import {
  AlertTriangle,
  FlaskConical,
  MapPin,
  MoveRight,
} from "lucide-react";

type ActivityType =
  | "sample"
  | "movement"
  | "alert"
  | "location";

type ActivityItemProps = {
  title: string;
  description: string;
  time: string;
  type: ActivityType;
};

export function ActivityItem({
  title,
  description,
  time,
  type,
}: ActivityItemProps) {
  const iconConfig = {
    sample: {
      icon: <FlaskConical size={18} />,
      style: "bg-accent/10 text-accent",
    },

    movement: {
      icon: <MoveRight size={18} />,
      style: "bg-accent/10 text-accent",
    },

    alert: {
      icon: <AlertTriangle size={18} />,
      style: "bg-warning/15 text-warning",
    },

    location: {
      icon: <MapPin size={18} />,
      style: "bg-accent/10 text-accent",
    },
  };

  const config = iconConfig[type];

  return (
    <div className="flex gap-4 py-4 first:pt-0 last:pb-0">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.style}`}
      >
        {config.icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
          <p className="font-bold text-primary">
            {title}
          </p>

          <span className="text-xs font-medium text-secondary">
            {time}
          </span>
        </div>

        <p className="mt-1 text-sm text-secondary">
          {description}
        </p>
      </div>
    </div>
  );
}