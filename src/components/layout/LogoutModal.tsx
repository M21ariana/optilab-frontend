"use client";

import { LogOut, X } from "lucide-react";
import { useEffect } from "react";

type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function LogoutModal({
  isOpen,
  onClose,
}: LogoutModalProps) {
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

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary/40 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
        className="w-full max-w-md rounded-3xl border border-border bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <LogOut size={22} />
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-secondary transition hover:bg-muted hover:text-primary"
          >
            <X size={18} />
          </button>
        </div>

        <h2
          id="logout-modal-title"
          className="mt-5 text-2xl font-black text-primary"
        >
          Cerrar sesión
        </h2>

        <p className="mt-3 text-sm leading-6 text-secondary">
          ¿Deseas cerrar tu sesión de OptiLab? Tendrás que iniciar sesión
          nuevamente para acceder al sistema.
        </p>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-border bg-white px-5 py-3 text-sm font-bold text-primary transition hover:border-accent"
          >
            Cancelar
          </button>

          <a
            href="/auth/logout"
            className="flex items-center gap-2 rounded-2xl bg-danger px-5 py-3 text-sm font-extrabold text-white transition hover:opacity-90"
          >
            <LogOut size={18} />
            Cerrar sesión
          </a>
        </div>
      </div>
    </div>
  );
}