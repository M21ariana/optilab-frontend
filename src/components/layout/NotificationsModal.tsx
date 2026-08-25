"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  NotificationItem,
  type Notification,
} from "@/components/notifications/NotificationItem";

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "occupancy",
    title: "Ubicación con alta ocupación",
    description: "La ubicación G1 alcanzó 90% de ocupación.",
    time: "Hace 15 min",
    href: "/locations/g1",
    isRead: false,
  },
  {
    id: 2,
    type: "expiration",
    title: "Muestra próxima a vencer",
    description: "La muestra RES-001 vence en 9 días.",
    time: "Hace 42 min",
    href: "/samples/RES-001",
    isRead: false,
  },
  {
    id: 3,
    type: "occupancy",
    title: "Capacidad cercana al límite",
    description: "La ubicación A1 alcanzó 92% de ocupación.",
    time: "Hace 1 h",
    href: "/locations/a1",
    isRead: true,
  },
];

type NotificationsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function NotificationsModal({
  isOpen,
  onClose,
}: NotificationsModalProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  function toggleReadStatus(id: number) {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              isRead: !notification.isRead,
            }
          : notification
      )
    );
  }

  if (!isOpen) {
    return null;
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary/40 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="notifications-modal-title"
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Centro de alertas
            </p>

            <h2
              id="notifications-modal-title"
              className="mt-1 text-2xl font-black text-primary"
            >
              Notificaciones
            </h2>

            <p className="mt-1 text-sm text-secondary">
              {unreadCount} sin leer
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar notificaciones"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-secondary transition hover:bg-muted hover:text-primary"
          >
            <X size={20} />
          </button>
        </div>

        {/* Notificaciones */}
        <div className="overflow-y-auto">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onNavigate={onClose}
              onToggleRead={() =>
                toggleReadStatus(notification.id)
              }
            />
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <Link
            href="/alerts"
            onClick={onClose}
            className="flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
          >
            Ver todas las alertas
          </Link>
        </div>
      </div>
    </div>
  );
}