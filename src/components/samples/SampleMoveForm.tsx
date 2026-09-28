"use client";

import {
  ArrowRight,
  MapPin,
  MoveRight,
} from "lucide-react";

import type {
  StorageRecommendation,
} from "@/lib/graphql/samples";

import type {
  SampleData,
} from "./types";

type SampleMoveFormProps = {
  sample: SampleData;

  recommendations: StorageRecommendation[];

  onConfirm: (
    storageLocationId: number,
    reason: string
  ) => Promise<void>;

  onCancel: () => void;

  isSaving: boolean;
};

export function SampleMoveForm({
  sample,
  recommendations,
  onConfirm,
  onCancel,
  isSaving,
}: SampleMoveFormProps) {
  const availableRecommendations =
    recommendations.filter(
      (recommendation) =>
        String(
          recommendation.storageLocation.id
        ) !== sample.locationId
    );

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formData =
      new FormData(event.currentTarget);

    const storageLocationId =
      Number(
        formData.get("storageLocationId")
      );

    const reason =
      String(
        formData.get("reason") ?? ""
      ).trim();

    if (
      !Number.isInteger(storageLocationId) ||
      storageLocationId <= 0
    ) {
      return;
    }

    if (!reason) {
      return;
    }

    await onConfirm(
      storageLocationId,
      reason
    );
  }

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Almacenamiento
        </p>

        <h2 className="mt-2 text-2xl font-black text-primary">
          Mover muestra
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary">
          Selecciona una nueva ubicación para
          la muestra y registra el motivo del
          movimiento.
        </p>
      </div>

      {/* Current location */}
      <div className="mt-6">
        <p className="text-xs font-bold uppercase tracking-wide text-secondary">
          Ubicación actual
        </p>

        <div className="mt-2 flex items-center gap-4 rounded-2xl border border-border bg-background p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <MapPin size={20} />
          </div>

          <div>
            <p className="font-black text-primary">
              {sample.locationCode ||
                "Sin ubicación"}
            </p>

            <p className="mt-1 text-sm text-secondary">
              {sample.locationName}
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-6"
      >
        {/* Destination */}
        <div>
          <label
            htmlFor="storageLocationId"
            className="text-sm font-bold text-primary"
          >
            Nueva ubicación
          </label>

          <select
            id="storageLocationId"
            name="storageLocationId"
            required
            disabled={
              isSaving ||
              availableRecommendations.length ===
                0
            }
            defaultValue=""
            className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-primary outline-none transition focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="" disabled>
              Selecciona una ubicación
            </option>

            {availableRecommendations.map(
              (recommendation) => {
                const location =
                  recommendation.storageLocation;

                return (
                  <option
                    key={location.id}
                    value={location.id}
                  >
                    {location.code} —{" "}
                    {location.name}
                  </option>
                );
              }
            )}
          </select>

          {availableRecommendations.length ===
            0 && (
            <p className="mt-2 text-sm text-secondary">
              No hay otras ubicaciones
              recomendadas disponibles para
              esta muestra.
            </p>
          )}
        </div>

        {/* Recommendations */}
        {availableRecommendations.length >
          0 && (
          <div>
            <p className="text-sm font-bold text-primary">
              Ubicaciones recomendadas
            </p>

            <div className="mt-3 grid gap-3">
              {availableRecommendations.map(
                (recommendation) => {
                  const location =
                    recommendation.storageLocation;

                  return (
                    <div
                      key={location.id}
                      className="rounded-2xl border border-border bg-white p-4"
                    >
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <MapPin
                              size={17}
                              className="text-accent"
                            />

                            <p className="font-black text-primary">
                              {location.code}
                            </p>
                          </div>

                          <p className="mt-1 text-sm text-secondary">
                            {location.name}
                          </p>
                        </div>

                        <span className="w-fit rounded-full bg-accent/10 px-3 py-1 text-xs font-extrabold text-accent">
                          Puntaje:{" "}
                          {recommendation.score}
                        </span>
                      </div>

                      {recommendation.reasons
                        .length > 0 && (
                        <ul className="mt-3 space-y-1 text-xs text-secondary">
                          {recommendation.reasons.map(
                            (reason) => (
                              <li
                                key={reason}
                                className="flex gap-2"
                              >
                                <span className="text-accent">
                                  •
                                </span>

                                <span>
                                  {reason}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* Reason */}
        <div>
          <label
            htmlFor="reason"
            className="text-sm font-bold text-primary"
          >
            Motivo del movimiento
          </label>

          <textarea
            id="reason"
            name="reason"
            required
            rows={4}
            disabled={isSaving}
            placeholder="Ej. Reorganización del inventario."
            className="mt-2 w-full resize-none rounded-2xl border border-border bg-white px-4 py-3 text-sm text-primary outline-none transition placeholder:text-secondary/60 focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
          />

          <p className="mt-2 text-xs text-secondary">
            Este motivo quedará registrado en
            el historial de movimientos de la
            muestra.
          </p>
        </div>

        {/* Movement preview */}
        <div className="flex items-center gap-3 rounded-2xl bg-background p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <MoveRight size={19} />
          </div>

          <div>
            <p className="text-xs font-bold text-secondary">
              Movimiento
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-bold text-primary">
              <span>
                {sample.locationCode ||
                  "Sin ubicación"}
              </span>

              <ArrowRight
                size={15}
                className="text-secondary"
              />

              <span>
                Nueva ubicación
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="rounded-2xl border border-border bg-white px-5 py-3 text-sm font-bold text-primary transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={
              isSaving ||
              availableRecommendations.length ===
                0
            }
            className="flex items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MoveRight size={18} />

            {isSaving
              ? "Moviendo..."
              : "Mover muestra"}
          </button>
        </div>
      </form>
    </section>
  );
}