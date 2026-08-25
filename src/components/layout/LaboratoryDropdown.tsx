"use client";

import { Check, ChevronDown, FlaskConical } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const laboratories = [
  {
    id: "central",
    name: "Laboratorio Central",
  },
  {
    id: "quality",
    name: "Laboratorio de Calidad",
  },
  {
    id: "research",
    name: "Laboratorio de Investigación",
  },
];

export function LaboratoryDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLaboratory, setSelectedLaboratory] = useState(
    laboratories[0]
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm transition hover:border-accent"
      >
        <span className="text-sm font-bold text-primary">
          {selectedLaboratory.name}
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-72 overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
          <div className="border-b border-border px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
              Laboratorio activo
            </p>
          </div>

          <div className="p-2">
            {laboratories.map((laboratory) => {
              const isSelected =
                laboratory.id === selectedLaboratory.id;

              return (
                <button
                  key={laboratory.id}
                  type="button"
                  onClick={() => {
                    setSelectedLaboratory(laboratory);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                    isSelected
                      ? "bg-accent/10"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <FlaskConical size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-primary">
                        {laboratory.name}
                      </p>

                      {isSelected && (
                        <p className="mt-0.5 text-xs text-secondary">
                          Seleccionado
                        </p>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <Check
                      size={17}
                      className="text-accent"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}