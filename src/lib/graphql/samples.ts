// ======================================================
// QUERIES
// ======================================================

export const SAMPLES_QUERY = `
  query Samples(
    $where: SampleWhereFilterInput
    $search: SearchInput
    $take: Int
    $skip: Int
    $orderBy: OrderByInputSample
  ) {
    samples(
      where: $where
      search: $search
      take: $take
      skip: $skip
      orderBy: $orderBy
    ) {
      data {
        id
        code
        name
        weightG
        expirationDate
        status

        materialType {
          id
          name
        }

        storageLocation {
          id
          code
          name
        }
      }

      count
      status
      error
    }
  }
`;

export const SAMPLE_QUERY = `
  query Sample($id: Int!) {
    sample(id: $id) {
      id
      laboratoryId
      storageLocationId
      materialTypeId

      code
      name
      description

      weightG
      volumeCm3
      areaCm2

      status

      entryDate
      expirationDate

      isStackable
      maxStackUnits

      requiresColdStorage
      requiresLightProtection
      isHazardous

      materialType {
        id
        name
      }

      storageLocation {
        id
        code
        name
      }

      laboratory {
        id
        name
      }
    }
  }
`;

export const STORAGE_RECOMMENDATIONS_QUERY = `
  query StorageRecommendations(
    $sampleId: Int!
  ) {
    recommendedStorageLocations(
      sampleId: $sampleId
    ) {
      score

      availableWeightG
      availableVolumeCm3
      availableAreaCm2

      reasons

      storageLocation {
        id
        code
        name
        type

        maxWeightG
        maxVolumeCm3
        maxAreaCm2

        supportsColdStorage
        supportsLightProtection
        supportsHazardous
      }
    }
  }
`;


// ======================================================
// SHARED TYPES
// ======================================================

export type SampleStatus =
  | "ACTIVE"
  | "ARCHIVED"
  | "DISCARDED"
  | "EXPIRED";


// ======================================================
// SAMPLE LIST
// ======================================================

export type SampleListItem = {
  id: string;

  code: string;
  name: string;

  weightG: number;

  expirationDate: string | null;

  status: SampleStatus;

  materialType: {
    id: string;
    name: string;
  };

  storageLocation: {
    id: string;
    code: string;
    name: string;
  } | null;
};

export type SamplesResponse = {
  samples: {
    data: SampleListItem[] | null;

    count: number | null;

    status: number | null;

    error: string | null;
  };
};


// ======================================================
// SAMPLE DETAIL
// ======================================================

export type SampleDetail = {
  id: string;

  laboratoryId: number;

  storageLocationId: number | null;

  materialTypeId: number;

  code: string;

  name: string;

  description: string | null;

  weightG: number;

  volumeCm3: number;

  areaCm2: number;

  status: SampleStatus;

  entryDate: string;

  expirationDate: string | null;

  isStackable: boolean;

  maxStackUnits: number | null;

  requiresColdStorage: boolean;

  requiresLightProtection: boolean;

  isHazardous: boolean;

  materialType: {
    id: string;
    name: string;
  };

  storageLocation: {
    id: string;
    code: string;
    name: string;
  } | null;

  laboratory: {
    id: string;
    name: string;
  };
};

export type SampleResponse = {
  sample: SampleDetail | null;
};


// ======================================================
// STORAGE RECOMMENDATIONS
// ======================================================

export type StorageRecommendation = {
  score: number;

  availableWeightG: number | null;

  availableVolumeCm3: number | null;

  availableAreaCm2: number | null;

  reasons: string[];

  storageLocation: {
    id: string;

    code: string;

    name: string;

    type: string;

    maxWeightG: number | null;

    maxVolumeCm3: number | null;

    maxAreaCm2: number | null;

    supportsColdStorage: boolean;

    supportsLightProtection: boolean;

    supportsHazardous: boolean;
  };
};

export type StorageRecommendationsResponse = {
  recommendedStorageLocations:
  StorageRecommendation[];
};


// ======================================================
// CREATE SAMPLE
// ======================================================

export const CREATE_SAMPLE_MUTATION = `
  mutation CreateSample(
    $data: SampleCreateInput!
  ) {
    createSample(
      data: $data
    ) {
      id

      laboratoryId
      storageLocationId
      materialTypeId

      code
      name
      description

      weightG
      volumeCm3
      areaCm2

      status

      entryDate
      expirationDate

      isStackable
      maxStackUnits

      requiresColdStorage
      requiresLightProtection
      isHazardous

      materialType {
        id
        name
      }

      storageLocation {
        id
        code
        name
      }

      laboratory {
        id
        name
      }
    }
  }
`;

export type CreateSampleInput = {
  laboratoryId: number;

  storageLocationId?: number;

  materialTypeId: number;

  name: string;

  code: string;

  description?: string;

  weightG: number;

  volumeCm3: number;

  areaCm2: number;

  status?: SampleStatus;

  entryDate?: string;

  expirationDate?: string;

  isStackable?: boolean;

  maxStackUnits?: number;

  requiresColdStorage?: boolean;

  requiresLightProtection?: boolean;

  isHazardous?: boolean;
};

export type CreateSampleResponse = {
  createSample: SampleDetail;
};


// ======================================================
// UPDATE SAMPLE
// ======================================================

export const UPDATE_SAMPLE_MUTATION = `
  mutation UpdateSample(
    $where: SampleWhereUniqueInput!
    $data: SampleUpdateInput!
  ) {
    updateSample(
      where: $where
      data: $data
    ) {
      id

      laboratoryId
      storageLocationId
      materialTypeId

      code
      name
      description

      weightG
      volumeCm3
      areaCm2

      status

      entryDate
      expirationDate

      isStackable
      maxStackUnits

      requiresColdStorage
      requiresLightProtection
      isHazardous

      materialType {
        id
        name
      }

      storageLocation {
        id
        code
        name
      }

      laboratory {
        id
        name
      }
    }
  }
`;

export type UpdateSampleInput = {
  laboratoryId?: number;

  storageLocationId?: number;

  materialTypeId?: number;

  name?: string;

  code?: string;

  description?: string;

  weightG?: number;

  volumeCm3?: number;

  areaCm2?: number;

  status?: SampleStatus;

  entryDate?: string;

  expirationDate?: string | null;

  isStackable?: boolean;

  maxStackUnits?: number | null;

  requiresColdStorage?: boolean;

  requiresLightProtection?: boolean;

  isHazardous?: boolean;
};

export type UpdateSampleResponse = {
  updateSample: SampleDetail;
};

// ======================================================
// MOVE SAMPLE
// ======================================================

export const MOVE_SAMPLE_MUTATION = `
  mutation MoveSample(
    $data: MoveSampleInput!
  ) {
    moveSample(
      data: $data
    ) {
      id

      laboratoryId
      storageLocationId
      materialTypeId

      code
      name
      description

      weightG
      volumeCm3
      areaCm2

      status

      entryDate
      expirationDate

      isStackable
      maxStackUnits

      requiresColdStorage
      requiresLightProtection
      isHazardous

      materialType {
        id
        name
      }

      storageLocation {
        id
        code
        name
      }

      laboratory {
        id
        name
      }
    }
  }
`;

export type MoveSampleInput = {
  sampleId: number;
  toLocationId: number;
  notes: string;
};

export type MoveSampleResponse = {
  moveSample: SampleDetail;
};