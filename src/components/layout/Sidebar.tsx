"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  AlertTriangle,
  BarChart3,
  Boxes,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  MapPin,
  Shuffle,
} from "lucide-react";

import { LogoutModal } from "./LogoutModal";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Muestras",
    href: "/samples",
    icon: FlaskConical,
  },
  {
    label: "Ubicaciones",
    href: "/locations",
    icon: MapPin,
  },
  {
    label: "Alertas",
    href: "/alerts",
    icon: AlertTriangle,
  },
  {
    label: "Movimientos",
    href: "/movements",
    icon: Shuffle,
  },
  {
    label: "Reportes",
    href: "/reports",
    icon: BarChart3,
  },
];

export function Sidebar({
  isCollapsed,
  onToggle,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
}) {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-white/10 bg-primary px-4 py-6 text-white transition-all duration-300 ${
          isCollapsed ? "w-24" : "w-72"
        }`}
      >
        {/* Logo */}
        <div className="mb-10 flex items-center justify-center">
          <button
            type="button"
            onClick={onToggle}
            className="transition hover:scale-105"
            aria-label={
              isCollapsed
                ? "Expandir barra lateral"
                : "Colapsar barra lateral"
            }
          >
            {isCollapsed ? (
              <Image
                src="/logo/optilab_icon.png"
                alt="OptiLab Icon"
                width={48}
                height={48}
                className="rounded-xl bg-white p-1.5 object-contain"
                style={{ height: "auto" }}
              />
            ) : (
              <Image
                src="/logo/optilab_logo.png"
                alt="OptiLab Logo"
                width={190}
                height={58}
                className="w-[190px] rounded-xl bg-white p-2 object-contain"
                style={{ height: "auto" }}
              />
            )}
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex flex-1 flex-col gap-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center rounded-2xl py-3 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white ${
                  isCollapsed
                    ? "justify-center px-0"
                    : "gap-3 px-4"
                }`}
              >
                <Icon size={20} />

                {!isCollapsed && (
                  <span>{item.label}</span>
                )}
              </Link>
            );
          })}

          {/* Cerrar sesión */}
          <button
            type="button"
            onClick={() => setIsLogoutOpen(true)}
            title={isCollapsed ? "Cerrar sesión" : undefined}
            className={`mt-2 flex items-center rounded-2xl py-3 text-sm font-bold text-white/80 transition hover:bg-danger/15 hover:text-white ${
              isCollapsed
                ? "justify-center px-0"
                : "gap-3 px-4"
            }`}
          >
            <LogOut size={20} />

            {!isCollapsed && (
              <span>Cerrar sesión</span>
            )}
          </button>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="mb-3 flex items-center gap-2 text-accent">
              <Boxes size={18} />

              <span className="text-xs font-extrabold uppercase tracking-widest">
                OptiLab
              </span>
            </div>

            <p className="text-xs leading-5 text-white/70">
              Sistema de gestión inteligente para inventarios de laboratorio.
            </p>
          </div>
        )}
      </aside>

      {/* Modal de cierre de sesión */}
      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
      />
    </>
  );
}