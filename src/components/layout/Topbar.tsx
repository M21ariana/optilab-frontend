"use client";

import { Bell, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { LaboratoryDropdown } from "./LaboratoryDropdown";
import { NotificationsModal } from "./NotificationsModal";

export function Topbar() {
  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState(false);

  return (
    <>
      <header className="flex h-20 items-center justify-between border-b border-border bg-surface px-8">
        {/* Brand */}
        <div>
          <h1 className="text-2xl font-black text-primary">
            OptiLab
          </h1>

          <p className="text-sm text-secondary">
            Optimize · Organize · Innovate
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Laboratory selector */}
          <LaboratoryDropdown />

          {/* Notifications */}
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(true)}
            className="relative rounded-2xl border border-border bg-white p-3 shadow-sm transition hover:border-accent"
            aria-label="Abrir notificaciones"
          >
            <Bell
              size={20}
              className="text-primary"
            />

            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-warning" />
          </button>

          {/* User profile */}
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-2 shadow-sm transition hover:border-accent"
          >
            <UserCircle2
              size={28}
              className="text-primary"
            />

            <div className="text-left">
              <p className="text-sm font-bold text-primary">
                María González
              </p>

              <p className="text-xs text-secondary">
                Administrador
              </p>
            </div>
          </Link>
        </div>
      </header>

      {/* Notifications modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
}