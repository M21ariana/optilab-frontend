// ======================================================
// SAMPLE MOVEMENTS QUERY
// ======================================================

export const SAMPLE_MOVEMENTS_QUERY = `
  query SampleMovements(
    $where: SampleMovementWhereFilterInput
    $search: SearchInput
    $take: Int
    $skip: Int
    $orderBy: OrderByInputSampleMovement
  ) {
    sampleMovements(
      where: $where
      search: $search
      take: $take
      skip: $skip
      orderBy: $orderBy
    ) {
      data {
        id
        sampleId

        fromLocationId
        toLocationId

        movementType
        notes

        performedByUserId
        createdAt

        sample {
          id
          name
          code
        }

        fromLocation {
          id
          code
          name
        }

        toLocation {
          id
          code
          name
        }

        performedBy {
          id
          fullName
        }
      }

      count
      status
      error
    }
  }
`;

// ======================================================
// MOVEMENT TYPES
// ======================================================

export type SampleMovementType =
  | "ENTRY"
  | "TRANSFER"
  | "EXIT";

// ======================================================
// RELATED ENTITIES
// ======================================================

export type MovementSample = {
  id: string;
  name: string;
  code: string;
};

export type MovementLocation = {
  id: string;
  code: string;
  name: string;
};

export type MovementUser = {
  id: string;
  fullName: string | null;
};

// ======================================================
// SAMPLE MOVEMENT
// ======================================================

export type SampleMovementRecord = {
  id: string;

  sampleId: number;

  fromLocationId: number | null;
  toLocationId: number | null;

  movementType: SampleMovementType;

  notes: string | null;

  performedByUserId: number | null;

  createdAt: string;

  sample: MovementSample;

  fromLocation: MovementLocation | null;

  toLocation: MovementLocation | null;

  performedBy: MovementUser | null;
};

// ======================================================
// RESPONSE
// ======================================================

export type SampleMovementsPayload = {
  data: SampleMovementRecord[] | null;
  count: number | null;
  status: number | null;
  error: string | null;
};

export type SampleMovementsResponse = {
  sampleMovements: SampleMovementsPayload;
};

// ======================================================
// FILTERS
// ======================================================

export type IntFilter = {
  equals?: number;
};

export type StringFilter = {
  equals?: string;
  contains?: string;
};

export type DateFilter = {
  equals?: string;
  gte?: string;
  lte?: string;
};

export type SampleMovementWhere = {
  AND?: SampleMovementWhere[];
  OR?: SampleMovementWhere[];
  NOT?: SampleMovementWhere[];

  id?: IntFilter;
  sampleId?: IntFilter;

  fromLocationId?: IntFilter;
  toLocationId?: IntFilter;

  movementType?: StringFilter;

  notes?: StringFilter;

  performedByUserId?: IntFilter;

  createdAt?: DateFilter;
};

// ======================================================
// ORDER BY
// ======================================================

export type SampleMovementOrderBy = {
  field:
    | "id"
    | "sampleId"
    | "fromLocationId"
    | "toLocationId"
    | "movementType"
    | "performedByUserId"
    | "createdAt";

  value: "asc" | "desc";
};