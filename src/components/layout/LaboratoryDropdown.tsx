"use client";

import {
  Building2,
  Check,
  ChevronDown,
  FlaskConical,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  LaboratoryOption,
} from "@/lib/graphql/sampleOptions";

type LaboratoryDropdownProps = {
  laboratories: LaboratoryOption[];
  selectedLaboratoryId: number | null;
  onChange: (
    laboratoryId: number | null
  ) => void;
};

export function LaboratoryDropdown({
  laboratories,
  selectedLaboratoryId,
  onChange,
}: LaboratoryDropdownProps) {
  const [isOpen, setIsOpen] =
    useState(false);

  const containerRef =
    useRef<HTMLDivElement>(null);

  // ======================================================
  // SELECTED LABORATORY
  // ======================================================

  const selectedLaboratory =
    selectedLaboratoryId === null
      ? null
      : laboratories.find(
          (laboratory) =>
            Number(laboratory.id) ===
            selectedLaboratoryId
        ) ?? null;

  // ======================================================
  // CLOSE ON OUTSIDE CLICK
  // ======================================================

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ======================================================
  // SELECT OPTION
  // ======================================================

  function handleSelect(
    laboratoryId: number | null
  ) {
    onChange(laboratoryId);
    setIsOpen(false);
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      {/* Trigger */}

      <button
        type="button"
        onClick={() =>
          setIsOpen(
            (previous) => !previous
          )
        }
        className="flex min-w-64 items-center justify-between gap-4 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm transition hover:border-accent"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            {selectedLaboratory ? (
              <FlaskConical
                size={17}
              />
            ) : (
              <Building2
                size={17}
              />
            )}
          </div>

          <div className="min-w-0 text-left">
            <p className="text-xs font-semibold text-secondary">
              Vista
            </p>

            <p className="max-w-48 truncate text-sm font-bold text-primary">
              {selectedLaboratory?.name ??
                "Toda la organización"}
            </p>
          </div>
        </div>

        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform ${
            isOpen
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      {/* Dropdown */}

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-80 overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
          {/* Header */}

          <div className="border-b border-border px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
              Alcance del dashboard
            </p>
          </div>

          {/* Options */}

          <div
            className="max-h-96 overflow-y-auto p-2"
            role="listbox"
          >
            {/* Organization */}

            <button
              type="button"
              role="option"
              aria-selected={
                selectedLaboratoryId ===
                null
              }
              onClick={() =>
                handleSelect(null)
              }
              className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                selectedLaboratoryId ===
                null
                  ? "bg-accent/10"
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Building2
                    size={17}
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-primary">
                    Toda la organización
                  </p>

                  <p className="mt-0.5 text-xs text-secondary">
                    Todos los laboratorios
                  </p>
                </div>
              </div>

              {selectedLaboratoryId ===
                null && (
                <Check
                  size={17}
                  className="shrink-0 text-accent"
                />
              )}
            </button>

            {/* Divider */}

            {laboratories.length >
              0 && (
              <div className="my-2 border-t border-border" />
            )}

            {/* Laboratories */}

            {laboratories.map(
              (laboratory) => {
                const laboratoryId =
                  Number(
                    laboratory.id
                  );

                const isSelected =
                  selectedLaboratoryId ===
                  laboratoryId;

                return (
                  <button
                    key={
                      laboratory.id
                    }
                    type="button"
                    role="option"
                    aria-selected={
                      isSelected
                    }
                    onClick={() =>
                      handleSelect(
                        laboratoryId
                      )
                    }
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition ${
                      isSelected
                        ? "bg-accent/10"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                        <FlaskConical
                          size={17}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-primary">
                          {
                            laboratory.name
                          }
                        </p>

                        {laboratory.description && (
                          <p className="mt-0.5 truncate text-xs text-secondary">
                            {
                              laboratory.description
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check
                        size={17}
                        className="shrink-0 text-accent"
                      />
                    )}
                  </button>
                );
              }
            )}

            {/* Empty state */}

            {laboratories.length ===
              0 && (
              <div className="px-3 py-5 text-center">
                <p className="text-sm font-bold text-primary">
                  No hay laboratorios
                </p>

                <p className="mt-1 text-xs text-secondary">
                  Tu organización no
                  tiene laboratorios
                  disponibles.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}