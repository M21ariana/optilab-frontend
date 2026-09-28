import {
  AlertTriangle,
  CalendarClock,
  ShieldAlert,
  ThermometerSnowflake,
} from "lucide-react";

import Link from "next/link";

// ----------------------------------------
// TYPES
// ----------------------------------------

export type Notification = {
  id: number;

  type:
    | "occupancy"
    | "expiration"
    | "storage"
    | "hazardous";

  title: string;
  description: string;
  time: string;
  href: string;
};

type NotificationItemProps = {
  notification: Notification;
  onNavigate: () => void;
};

// ----------------------------------------
// COMPONENT
// ----------------------------------------

export function NotificationItem({
  notification,
  onNavigate,
}: NotificationItemProps) {
  const config =
    getNotificationConfig(
      notification.type
    );

  return (
    <div className="flex gap-4 border-b border-border bg-white px-6 py-5 transition last:border-b-0 hover:bg-muted/30">
      {/* Icon */}

      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${config.style}`}
      >
        {config.icon}
      </div>

      {/* Content */}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-6">
          {/* Title */}

          <Link
            href={notification.href}
            onClick={onNavigate}
            className="min-w-0 font-black text-primary transition hover:text-accent"
          >
            {notification.title}
          </Link>

          {/* Time */}

          <span className="shrink-0 text-xs text-secondary">
            {notification.time}
          </span>
        </div>

        {/* Description */}

        <Link
          href={notification.href}
          onClick={onNavigate}
          className="block"
        >
          <p className="mt-1 text-sm leading-6 text-secondary">
            {notification.description}
          </p>
        </Link>

        {/* Action */}

        <Link
          href={notification.href}
          onClick={onNavigate}
          className="mt-2 inline-block text-xs font-bold text-accent transition hover:opacity-70"
        >
          Ver detalle
        </Link>
      </div>
    </div>
  );
}

// ----------------------------------------
// CONFIG
// ----------------------------------------

function getNotificationConfig(
  type: Notification["type"]
) {
  switch (type) {
    case "expiration":
      return {
        icon: (
          <CalendarClock size={20} />
        ),
        style:
          "bg-danger/10 text-danger",
      };

    case "storage":
      return {
        icon: (
          <ThermometerSnowflake
            size={20}
          />
        ),
        style:
          "bg-warning/15 text-warning",
      };

    case "hazardous":
      return {
        icon: (
          <ShieldAlert size={20} />
        ),
        style:
          "bg-danger/10 text-danger",
      };

    case "occupancy":
    default:
      return {
        icon: (
          <AlertTriangle size={20} />
        ),
        style:
          "bg-warning/15 text-warning",
      };
  }
}