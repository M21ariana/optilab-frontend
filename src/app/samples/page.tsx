import { AppLayout } from "@/components/layout/AppLayout";

import {
  FlaskConical,
  Plus,
  Search,
} from "lucide-react";

import Link from "next/link";

import {
  ME_QUERY,
  type MeResponse,
} from "@/lib/graphql/profile";

import { auth0 } from "@/lib/auth0";
import { graphqlRequest } from "@/lib/graphql/client";

import {
  SAMPLES_QUERY,
  type SamplesResponse,
  type SampleStatus,
} from "@/lib/graphql/samples";

import {
  MATERIAL_TYPES_QUERY,
  LABORATORIES_QUERY,
  type MaterialTypesResponse,
  type LaboratoriesResponse,
} from "@/lib/graphql/sampleOptions";

// ======================================================
// CONSTANTS
// ======================================================

const PAGE_SIZE = 10;

const VALID_STATUSES: SampleStatus[] = [
  "ACTIVE",
  "ARCHIVED",
  "DISCARDED",
  "EXPIRED",
];

const VALID_SORT_FIELDS = [
  "name",
  "code",
  "weightG",
  "status",
  "entryDate",
  "expirationDate",
  "createdAt",
] as const;

const VALID_DIRECTIONS = [
  "asc",
  "desc",
] as const;

type SortField =
  (typeof VALID_SORT_FIELDS)[number];

type SortDirection =
  (typeof VALID_DIRECTIONS)[number];

type SearchParams = {
  page?: string;
  search?: string;
  status?: string;
  materialTypeId?: string;
  sort?: string;
  direction?: string;
};

// ======================================================
// HELPERS
// ======================================================

function formatDate(date: string | null) {
  if (!date) {
    return "No aplica";
  }

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

function getStatusInfo(status: string) {
  switch (status) {
    case "ACTIVE":
      return {
        label: "ACTIVA",
        backgroundColor: "#E5F4F1",
        textColor: "#169C8C",
      };

    case "EXPIRED":
      return {
        label: "VENCIDA",
        backgroundColor: "#FDE8E8",
        textColor: "#C24141",
      };

    case "ARCHIVED":
      return {
        label: "ARCHIVADA",
        backgroundColor: "#E9EEF2",
        textColor: "#526575",
      };

    case "DISCARDED":
      return {
        label: "DESCARTADA",
        backgroundColor: "#FFF1D6",
        textColor: "#A86608",
      };

    default:
      return {
        label: status,
        backgroundColor: "#F1F3F5",
        textColor: "#667085",
      };
  }
}

function isSampleStatus(
  value: string | undefined
): value is SampleStatus {
  return VALID_STATUSES.includes(
    value as SampleStatus
  );
}

function isSortField(
  value: string | undefined
): value is SortField {
  return VALID_SORT_FIELDS.includes(
    value as SortField
  );
}

function isSortDirection(
  value: string | undefined
): value is SortDirection {
  return VALID_DIRECTIONS.includes(
    value as SortDirection
  );
}

function buildPageUrl(
  currentParams: SearchParams,
  page: number
) {
  const params = new URLSearchParams();

  if (currentParams.search) {
    params.set(
      "search",
      currentParams.search
    );
  }

  if (currentParams.status) {
    params.set(
      "status",
      currentParams.status
    );
  }

  if (currentParams.materialTypeId) {
    params.set(
      "materialTypeId",
      currentParams.materialTypeId
    );
  }

  if (currentParams.sort) {
    params.set(
      "sort",
      currentParams.sort
    );
  }

  if (currentParams.direction) {
    params.set(
      "direction",
      currentParams.direction
    );
  }

  params.set("page", String(page));

  return `/samples?${params.toString()}`;
}

// ======================================================
// PAGE
// ======================================================

export default async function SamplesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // ------------------------------------------------------
  // AUTH
  // ------------------------------------------------------

  const { token } =
    await auth0.getAccessToken();

  if (!token) {
    throw new Error(
      "No se encontró una sesión autenticada."
    );
  }

  // ------------------------------------------------------
  // CURRENT USER
  // ------------------------------------------------------

  const meResult =
    await graphqlRequest<MeResponse>(
      ME_QUERY,
      undefined,
      token
    );

  const organizationId =
    meResult.me?.organization?.id;

  if (!organizationId) {
    throw new Error(
      "El usuario no pertenece a una organización."
    );
  }

  // ------------------------------------------------------
  // ORGANIZATION LABORATORIES
  // ------------------------------------------------------

  const laboratoriesResult =
    await graphqlRequest<LaboratoriesResponse>(
      LABORATORIES_QUERY,
      {
        where: {
          AND: [
            {
              organizationId: {
                equals: Number(
                  organizationId
                ),
              },
            },
          ],
        },
      },
      token
    );

  const laboratories =
    laboratoriesResult.laboratories.data ?? [];

  const laboratoryIds =
    laboratories.map(
      (laboratory) =>
        Number(laboratory.id)
    );

  // ------------------------------------------------------
  // URL PARAMS
  // ------------------------------------------------------

  const params = await searchParams;

  const search =
    params.search?.trim() ?? "";

  const status = isSampleStatus(
    params.status
  )
    ? params.status
    : undefined;

  const materialTypeId =
    params.materialTypeId &&
    Number.isInteger(
      Number(params.materialTypeId)
    ) &&
    Number(params.materialTypeId) > 0
      ? Number(params.materialTypeId)
      : undefined;

  // ------------------------------------------------------
  // SORT
  // ------------------------------------------------------
  // There is no automatic sort selection.
  //
  // The backend receives orderBy ONLY when:
  // 1. A field was selected.
  // 2. A direction was selected.
  // ------------------------------------------------------

  const sort = isSortField(
    params.sort
  )
    ? params.sort
    : undefined;

  const direction = isSortDirection(
    params.direction
  )
    ? params.direction
    : undefined;

  const hasCompleteSorting =
    Boolean(sort && direction);

  // ------------------------------------------------------
  // PAGINATION
  // ------------------------------------------------------

  const requestedPage =
    Number(params.page);

  const page =
    Number.isInteger(requestedPage) &&
    requestedPage > 0
      ? requestedPage
      : 1;

  const skip =
    (page - 1) * PAGE_SIZE;

  // ------------------------------------------------------
  // WHERE
  // ------------------------------------------------------

  const andConditions: Array<
    Record<string, unknown>
  > = [];

  // ----------------------------------------
  // STATUS
  // ----------------------------------------

  if (status) {
    andConditions.push({
      status: {
        equals: status,
      },
    });
  }

  // ----------------------------------------
  // MATERIAL TYPE
  // ----------------------------------------

  if (materialTypeId) {
    andConditions.push({
      materialTypeId: {
        equals: materialTypeId,
      },
    });
  }

  // ----------------------------------------
  // ORGANIZATION LABORATORIES
  // ----------------------------------------
  //
  // IntFilter does not support:
  //
  // laboratoryId: {
  //   in: [7, 8]
  // }
  //
  // So each laboratory becomes an OR
  // condition using equals.
  // ----------------------------------------

  const organizationLaboratoryConditions =
    laboratoryIds.map(
      (laboratoryId) => ({
        laboratoryId: {
          equals: laboratoryId,
        },
      })
    );

  // ------------------------------------------------------
  // GRAPHQL VARIABLES
  // ------------------------------------------------------

  const variables: Record<
    string,
    unknown
  > = {
    take: PAGE_SIZE,
    skip,
  };

  if (hasCompleteSorting) {
    variables.orderBy = {
      field: sort,
      value: direction,
    };
  }

  // Only create the WHERE clause if the organization
  // actually has laboratories.
  //
  // If it has no laboratories, we will skip the samples
  // request completely below. This prevents accidentally
  // loading samples from another organization.

  if (laboratoryIds.length > 0) {
    variables.where = {
      AND: andConditions,
      OR: organizationLaboratoryConditions,
    };
  }

  if (search) {
    variables.search = {
      value: search,

      columns: {
        strings: [
          "name",
          "code",
          "description",
        ],
      },
    };
  }

  // ------------------------------------------------------
  // LOAD DATA
  // ------------------------------------------------------

  const [
    samplesResult,
    materialTypesResult,
  ] = await Promise.all([
    laboratoryIds.length > 0
      ? graphqlRequest<SamplesResponse>(
          SAMPLES_QUERY,
          variables,
          token
        )
      : Promise.resolve(null),

    graphqlRequest<MaterialTypesResponse>(
      MATERIAL_TYPES_QUERY,
      {},
      token
    ),
  ]);

  // ------------------------------------------------------
  // VALIDATE SAMPLES RESPONSE
  // ------------------------------------------------------

  if (
    samplesResult &&
    samplesResult.samples.status !== 200
  ) {
    throw new Error(
      samplesResult.samples.error ??
        "No fue posible cargar las muestras."
    );
  }

  // ------------------------------------------------------
  // NORMALIZE DATA
  // ------------------------------------------------------

  const samples =
    samplesResult?.samples.data ?? [];

  const totalItems =
    samplesResult?.samples.count ?? 0;

  const materialTypes =
    materialTypesResult.materialTypes.data ??
    [];

  // ------------------------------------------------------
  // PAGINATION
  // ------------------------------------------------------

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalItems / PAGE_SIZE
    )
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const firstItem =
    totalItems === 0
      ? 0
      : skip + 1;

  const lastItem = Math.min(
    skip + samples.length,
    totalItems
  );

  const hasPrevious =
    currentPage > 1;

  const hasNext =
    currentPage < totalPages;

  const startPage = Math.max(
    1,
    currentPage - 2
  );

  const endPage = Math.min(
    totalPages,
    currentPage + 2
  );

  const pageNumbers =
    Array.from(
      {
        length:
          endPage -
          startPage +
          1,
      },
      (_, index) =>
        startPage + index
    );

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* ============================================== */}
        {/* HEADER */}
        {/* ============================================== */}

        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
              Inventario
            </p>

            <h1 className="mt-2 text-4xl font-black text-primary">
              Muestras
            </h1>

            <p className="mt-2 text-secondary">
              Consulta, filtra y gestiona
              las muestras registradas en
              los laboratorios de tu
              organización.
            </p>
          </div>

          <Link
            href="/samples/new"
            className="flex items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-accent/20 transition hover:opacity-90"
          >
            <Plus size={18} />
            Nueva muestra
          </Link>
        </section>

        {/* ============================================== */}
        {/* CONTENT */}
        {/* ============================================== */}

        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          {/* ============================================ */}
          {/* SEARCH + FILTERS */}
          {/* ============================================ */}

          <form
            method="GET"
            action="/samples"
            className="space-y-4"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
              {/* SEARCH */}

              <div className="flex-1">
                <label
                  htmlFor="search"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-secondary"
                >
                  Buscar
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3">
                  <Search
                    size={18}
                    className="shrink-0 text-accent"
                  />

                  <input
                    key={`search-${search}`}
                    id="search"
                    name="search"
                    defaultValue={search}
                    placeholder="Nombre, código, ubicación..."
                    className="w-full bg-transparent text-sm text-primary outline-none placeholder:text-secondary/50"
                  />
                </div>
              </div>

              {/* STATUS */}

              <div className="xl:w-48">
                <label
                  htmlFor="status"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-secondary"
                >
                  Estado
                </label>

                <select
                  key={`status-${status ?? "all"}`}
                  id="status"
                  name="status"
                  defaultValue={
                    status ?? ""
                  }
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm font-bold text-primary outline-none transition focus:border-accent"
                >
                  <option value="">
                    Todos
                  </option>

                  <option value="ACTIVE">
                    Activas
                  </option>

                  <option value="EXPIRED">
                    Vencidas
                  </option>

                  <option value="ARCHIVED">
                    Archivadas
                  </option>

                  <option value="DISCARDED">
                    Descartadas
                  </option>
                </select>
              </div>

              {/* MATERIAL TYPE */}

              <div className="xl:w-56">
                <label
                  htmlFor="materialTypeId"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-secondary"
                >
                  Tipo
                </label>

                <select
                  key={`material-${materialTypeId ?? "all"}`}
                  id="materialTypeId"
                  name="materialTypeId"
                  defaultValue={
                    materialTypeId
                      ? String(
                          materialTypeId
                        )
                      : ""
                  }
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm font-bold text-primary outline-none transition focus:border-accent"
                >
                  <option value="">
                    Todos
                  </option>

                  {materialTypes.map(
                    (materialType) => (
                      <option
                        key={
                          materialType.id
                        }
                        value={
                          materialType.id
                        }
                      >
                        {
                          materialType.name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* SORT */}

              <div className="xl:w-52">
                <label
                  htmlFor="sort"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-secondary"
                >
                  Ordenar por
                </label>

                <select
                  key={`sort-${sort ?? "none"}`}
                  id="sort"
                  name="sort"
                  defaultValue={
                    sort ?? ""
                  }
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm font-bold text-primary outline-none transition focus:border-accent"
                >
                  <option value="">
                    Seleccionar...
                  </option>

                  <option value="createdAt">
                    Fecha de registro
                  </option>

                  <option value="name">
                    Nombre
                  </option>

                  <option value="code">
                    Código
                  </option>

                  <option value="weightG">
                    Peso
                  </option>

                  <option value="expirationDate">
                    Vencimiento
                  </option>

                  <option value="entryDate">
                    Fecha de ingreso
                  </option>

                  <option value="status">
                    Estado
                  </option>
                </select>
              </div>

              {/* DIRECTION */}

              <div className="xl:w-48">
                <label
                  htmlFor="direction"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-secondary"
                >
                  Dirección
                </label>

                <select
                  key={`direction-${direction ?? "none"}`}
                  id="direction"
                  name="direction"
                  defaultValue={
                    direction ?? ""
                  }
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm font-bold text-primary outline-none transition focus:border-accent"
                >
                  <option value="">
                    Seleccionar...
                  </option>

                  <option value="asc">
                    Ascendente
                  </option>

                  <option value="desc">
                    Descendente
                  </option>
                </select>
              </div>
            </div>

            {/* SORTING EXPLANATION */}

            <p className="text-xs text-secondary">
              Para ordenar las muestras,
              selecciona tanto el criterio
              de orden como la dirección.
            </p>

            {/* ACTIONS */}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="rounded-2xl bg-primary px-5 py-3 text-sm font-extrabold text-white transition hover:opacity-90"
              >
                Aplicar
              </button>

              <Link
                href="/samples"
                className="rounded-2xl border border-border bg-white px-5 py-3 text-sm font-bold text-secondary transition hover:border-accent hover:text-accent"
              >
                Limpiar filtros
              </Link>
            </div>
          </form>

          {/* ============================================ */}
          {/* RESULTS INFO */}
          {/* ============================================ */}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-secondary">
              {totalItems === 0 ? (
                "No se encontraron muestras."
              ) : (
                <>
                  Mostrando{" "}
                  <span className="font-bold text-primary">
                    {firstItem}–
                    {lastItem}
                  </span>{" "}
                  de{" "}
                  <span className="font-bold text-primary">
                    {totalItems}
                  </span>{" "}
                  muestras
                </>
              )}
            </p>

            {(search ||
              status ||
              materialTypeId ||
              hasCompleteSorting) && (
              <p className="text-xs font-bold text-accent">
                Filtros activos
              </p>
            )}
          </div>

          {/* ============================================ */}
          {/* TABLE */}
          {/* ============================================ */}

          <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[950px] border-collapse bg-white text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-wider text-secondary">
                <tr>
                  <th className="px-5 py-4">
                    Código
                  </th>

                  <th className="px-5 py-4">
                    Muestra
                  </th>

                  <th className="px-5 py-4">
                    Tipo
                  </th>

                  <th className="px-5 py-4">
                    Ubicación
                  </th>

                  <th className="px-5 py-4">
                    Peso
                  </th>

                  <th className="px-5 py-4">
                    Vencimiento
                  </th>

                  <th className="px-5 py-4">
                    Estado
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {samples.map((sample) => {
                  const statusInfo =
                    getStatusInfo(
                      sample.status
                    );

                  return (
                    <tr
                      key={sample.id}
                      className="transition hover:bg-background/60"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/samples/${sample.id}`}
                          className="font-bold text-primary transition hover:text-accent"
                        >
                          {sample.code}
                        </Link>
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          href={`/samples/${sample.id}`}
                          className="group flex items-center gap-3"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                            <FlaskConical
                              size={18}
                            />
                          </div>

                          <div>
                            <p className="font-bold text-primary transition group-hover:text-accent">
                              {
                                sample.name
                              }
                            </p>

                            <p className="text-xs text-secondary">
                              Registro de
                              inventario
                            </p>
                          </div>
                        </Link>
                      </td>

                      <td className="px-5 py-4 text-secondary">
                        {
                          sample
                            .materialType
                            .name
                        }
                      </td>

                      <td className="px-5 py-4">
                        {sample.storageLocation ? (
                          <Link
                            href={`/locations/${sample.storageLocation.id}`}
                            className="font-bold text-primary transition hover:text-accent"
                          >
                            {
                              sample
                                .storageLocation
                                .code
                            }
                          </Link>
                        ) : (
                          <span className="text-secondary">
                            Sin ubicación
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-secondary">
                        {sample.weightG} g
                      </td>

                      <td className="px-5 py-4 text-secondary">
                        {formatDate(
                          sample.expirationDate
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="rounded-full px-3 py-1 text-xs font-extrabold"
                          style={{
                            backgroundColor:
                              statusInfo.backgroundColor,
                            color:
                              statusInfo.textColor,
                          }}
                        >
                          {
                            statusInfo.label
                          }
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {samples.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center"
                    >
                      <p className="font-bold text-primary">
                        No encontramos
                        muestras
                      </p>

                      <p className="mt-1 text-sm text-secondary">
                        Prueba cambiando la
                        búsqueda o los
                        filtros seleccionados.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ============================================ */}
          {/* PAGINATION */}
          {/* ============================================ */}

          {totalItems > 0 && (
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-secondary">
                Página{" "}
                <span className="font-bold text-primary">
                  {currentPage}
                </span>{" "}
                de{" "}
                <span className="font-bold text-primary">
                  {totalPages}
                </span>
              </p>

              <nav
                aria-label="Paginación de muestras"
                className="flex flex-wrap items-center gap-2"
              >
                {hasPrevious ? (
                  <Link
                    href={buildPageUrl(
                      params,
                      currentPage - 1
                    )}
                    className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-bold text-primary transition hover:border-accent hover:text-accent"
                  >
                    Anterior
                  </Link>
                ) : (
                  <span className="cursor-not-allowed rounded-xl border border-border bg-muted px-4 py-2 text-sm font-bold text-secondary/50">
                    Anterior
                  </span>
                )}

                {startPage > 1 && (
                  <>
                    <Link
                      href={buildPageUrl(
                        params,
                        1
                      )}
                      className="flex h-9 min-w-9 items-center justify-center rounded-xl border border-border bg-white px-3 text-sm font-bold text-primary transition hover:border-accent hover:text-accent"
                    >
                      1
                    </Link>

                    {startPage > 2 && (
                      <span className="px-1 text-secondary">
                        …
                      </span>
                    )}
                  </>
                )}

                {pageNumbers.map(
                  (pageNumber) => {
                    const isCurrent =
                      pageNumber ===
                      currentPage;

                    return isCurrent ? (
                      <span
                        key={
                          pageNumber
                        }
                        aria-current="page"
                        className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-accent px-3 text-sm font-extrabold text-white"
                      >
                        {pageNumber}
                      </span>
                    ) : (
                      <Link
                        key={
                          pageNumber
                        }
                        href={buildPageUrl(
                          params,
                          pageNumber
                        )}
                        className="flex h-9 min-w-9 items-center justify-center rounded-xl border border-border bg-white px-3 text-sm font-bold text-primary transition hover:border-accent hover:text-accent"
                      >
                        {pageNumber}
                      </Link>
                    );
                  }
                )}

                {endPage < totalPages && (
                  <>
                    {endPage <
                      totalPages - 1 && (
                      <span className="px-1 text-secondary">
                        …
                      </span>
                    )}

                    <Link
                      href={buildPageUrl(
                        params,
                        totalPages
                      )}
                      className="flex h-9 min-w-9 items-center justify-center rounded-xl border border-border bg-white px-3 text-sm font-bold text-primary transition hover:border-accent hover:text-accent"
                    >
                      {totalPages}
                    </Link>
                  </>
                )}

                {hasNext ? (
                  <Link
                    href={buildPageUrl(
                      params,
                      currentPage + 1
                    )}
                    className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-bold text-primary transition hover:border-accent hover:text-accent"
                  >
                    Siguiente
                  </Link>
                ) : (
                  <span className="cursor-not-allowed rounded-xl border border-border bg-muted px-4 py-2 text-sm font-bold text-secondary/50">
                    Siguiente
                  </span>
                )}
              </nav>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}