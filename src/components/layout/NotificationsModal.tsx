"use client";

import {
  AlertTriangle,
  X,
} from "lucide-react";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  NotificationItem,
  type Notification,
} from "@/components/notifications/NotificationItem";

import { getActiveAlerts } from "@/app/alerts/actions";

import type { Alert } from "@/lib/graphql/alerts";

// ----------------------------------------
// TYPES
// ----------------------------------------

type NotificationsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// ----------------------------------------
// COMPONENT
// ----------------------------------------

export function NotificationsModal({
  isOpen,
  onClose,
}: NotificationsModalProps) {
  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  // ----------------------------------------
  // LOAD ALERTS
  // ----------------------------------------

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let cancelled = false;

    async function loadAlerts() {
      try {
        setIsLoading(true);
        setError(null);

        const alerts =
          await getActiveAlerts();

        if (cancelled) {
          return;
        }

        const mappedNotifications =
          alerts.map(
            alertToNotification
          );

        setNotifications(
          mappedNotifications
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las alertas."
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadAlerts();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // ----------------------------------------
  // MODAL BEHAVIOR
  // ----------------------------------------

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, onClose]);

  // ----------------------------------------
  // CLOSED
  // ----------------------------------------

  if (!isOpen) {
    return null;
  }

  // ----------------------------------------
  // RENDER
  // ----------------------------------------

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
        onClick={(event) =>
          event.stopPropagation()
        }
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
              {isLoading
                ? "Cargando alertas..."
                : `${notifications.length} alertas activas`}
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

        {/* Content */}

        <div className="overflow-y-auto">
          {isLoading && (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-medium text-secondary">
                Cargando alertas...
              </p>
            </div>
          )}

          {!isLoading && error && (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                <AlertTriangle
                  size={22}
                />
              </div>

              <p className="mt-4 font-bold text-primary">
                No pudimos cargar las
                alertas
              </p>

              <p className="mt-1 text-sm text-secondary">
                {error}
              </p>
            </div>
          )}

          {!isLoading &&
            !error &&
            notifications.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="font-bold text-primary">
                  Todo está en orden
                </p>

                <p className="mt-1 text-sm text-secondary">
                  No hay alertas activas en
                  este momento.
                </p>
              </div>
            )}

          {!isLoading &&
            !error &&
            notifications.map(
              (notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={
                    notification
                  }
                  onNavigate={onClose}
                />
              )
            )}
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

// ----------------------------------------
// ALERT -> NOTIFICATION
// ----------------------------------------

function alertToNotification(
  alert: Alert
): Notification {
  const href =
    getAlertHref(alert);

  return {
    id: Number(alert.id),

    type:
      getNotificationType(
        alert.alertType
      ),

    title:
      getAlertTitle(
        alert.alertType
      ),

    description:
      alert.message,

    time:
      getRelativeTime(
        alert.createdAt
      ),

    href,

  };
}

// ----------------------------------------
// NOTIFICATION TYPE
// ----------------------------------------

function getNotificationType(
  alertType: Alert["alertType"]
): Notification["type"] {
  switch (alertType) {
    case "HIGH_OCCUPANCY":
      return "occupancy";

    case "EXPIRATION":
    case "EXPIRATION_WARNING":
      return "expiration";

    case "STORAGE_REQUIREMENT":
      return "storage";

    case "HAZARDOUS_MATERIAL":
      return "hazardous";

    default:
      return "occupancy";
  }
}

// ----------------------------------------
// TITLE
// ----------------------------------------

function getAlertTitle(
  alertType: Alert["alertType"]
) {
  switch (alertType) {
    case "HIGH_OCCUPANCY":
      return "Ubicación con alta ocupación";

    case "EXPIRATION":
      return "Muestra vencida";

    case "EXPIRATION_WARNING":
      return "Muestra próxima a vencer";

    case "STORAGE_REQUIREMENT":
      return "Condición de almacenamiento incompatible";

    case "HAZARDOUS_MATERIAL":
      return "Material peligroso";

    default:
      return "Alerta";
  }
}

// ----------------------------------------
// LINK
// ----------------------------------------

function getAlertHref(
  alert: Alert
) {
  if (
    alert.alertType ===
      "HIGH_OCCUPANCY" &&
    alert.storageLocationId
  ) {
    return `/locations/${alert.storageLocationId}`;
  }

  if (alert.sampleId) {
    return `/samples/${alert.sampleId}`;
  }

  if (alert.storageLocationId) {
    return `/locations/${alert.storageLocationId}`;
  }

  return "/alerts";
}

// ----------------------------------------
// RELATIVE TIME
// ----------------------------------------

function getRelativeTime(
  date: string | null
) {
  if (!date) {
    return "";
  }

  const createdAt =
    new Date(date);

  const now =
    new Date();

  const difference =
    now.getTime() -
    createdAt.getTime();

  const minutes =
    Math.floor(
      difference /
        (1000 * 60)
    );

  if (minutes < 1) {
    return "Ahora";
  }

  if (minutes < 60) {
    return `Hace ${minutes} min`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  if (hours < 24) {
    return `Hace ${hours} h`;
  }

  const days =
    Math.floor(
      hours / 24
    );

  if (days === 1) {
    return "Hace 1 día";
  }

  return `Hace ${days} días`;
}