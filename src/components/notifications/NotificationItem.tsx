import {
  AlertTriangle,
  CalendarClock,
} from "lucide-react";

import Link from "next/link";

export type Notification = {
  id: number;
  type: "occupancy" | "expiration";
  title: string;
  description: string;
  time: string;
  href: string;
  isRead: boolean;
};

type NotificationItemProps = {
  notification: Notification;
  onNavigate: () => void;
  onToggleRead: () => void;
};

export function NotificationItem({
  notification,
  onNavigate,
  onToggleRead,
}: NotificationItemProps) {
  const config =
    notification.type === "expiration"
      ? {
          icon: <CalendarClock size={20} />,
          style: "bg-danger/10 text-danger",
        }
      : {
          icon: <AlertTriangle size={20} />,
          style: "bg-warning/15 text-warning",
        };

  return (
    <div
      className={`flex gap-4 border-b border-border px-6 py-5 transition last:border-b-0 ${
        notification.isRead
          ? "bg-white"
          : "bg-accent/[0.04]"
      }`}
    >
      {/* Icono de la alerta */}
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${config.style}`}
      >
        {config.icon}
      </div>

      {/* Contenido */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-6">
          {/* Estado + título */}
          <div className="flex min-w-0 items-center gap-2">
            {/* Botón leído / no leído */}
            <button
              type="button"
              onClick={onToggleRead}
              title={
                notification.isRead
                  ? "Marcar como no leída"
                  : "Marcar como leída"
              }
              aria-label={
                notification.isRead
                  ? "Marcar como no leída"
                  : "Marcar como leída"
              }
              className="group flex h-5 w-5 shrink-0 items-center justify-center"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full border-2 border-accent transition-all ${
                  notification.isRead
                    ? "bg-transparent opacity-40 group-hover:opacity-100"
                    : "bg-accent group-hover:scale-125"
                }`}
              />
            </button>

            {/* Título */}
            <Link
              href={notification.href}
              onClick={onNavigate}
              className={`text-base text-primary transition hover:text-accent ${
                notification.isRead
                  ? "font-semibold"
                  : "font-black"
              }`}
            >
              {notification.title}
            </Link>
          </div>

          {/* Hora */}
          <span className="shrink-0 text-xs text-secondary">
            {notification.time}
          </span>
        </div>

        {/* Descripción */}
        <Link
          href={notification.href}
          onClick={onNavigate}
          className="block"
        >
          <p className="mt-1 text-sm leading-6 text-secondary">
            {notification.description}
          </p>
        </Link>

        {/* Estado */}
        <p
          className={`mt-2 text-xs font-bold ${
            notification.isRead
              ? "text-secondary"
              : "text-accent"
          }`}
        >
          {notification.isRead ? "Leída" : "No leída"}
        </p>
      </div>
    </div>
  );
}