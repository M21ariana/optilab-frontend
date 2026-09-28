// ======================================================
// LABORATORIES
// ======================================================

export const LABORATORIES_QUERY = `
  query Laboratories(
    $where: LaboratoryWhereFilterInput
  ) {
    laboratories(
      where: $where
    ) {
      data {
        id
        organizationId
        name
        description
      }

      count
      status
      error
    }
  }
`;

export type LaboratoryOption = {
  id: string;
  organizationId: number;
  name: string;
  description: string | null;
};

export type LaboratoriesResponse = {
  laboratories: {
    data: LaboratoryOption[] | null;
    count: number | null;
    status: number | null;
    error: string | null;
  };
};

// ======================================================
// MATERIAL TYPES
// ======================================================

export const MATERIAL_TYPES_QUERY = `
  query MaterialTypes {
    materialTypes {
      data {
        id
        name
        description
      }

      count
      status
      error
    }
  }
`;

export type MaterialTypeOption = {
  id: string;
  name: string;
  description: string | null;
};

export type MaterialTypesResponse = {
  materialTypes: {
    data: MaterialTypeOption[] | null;
    count: number | null;
    status: number | null;
    error: string | null;
  };
};