// ----------------------------------------
// TYPES
// ----------------------------------------

export type StorageLocation = {
    id: string;
    laboratoryId: number;

    code: string;
    name: string;
    type: string;
    description: string | null;

    maxVolumeCm3: number | null;
    maxAreaCm2: number | null;
    maxWeightG: number | null;

    sampleCount: number;
    usedAreaCm2: number;
    occupancy: number;

    supportsColdStorage: boolean;
    supportsLightProtection: boolean;
    supportsHazardous: boolean;

    laboratory: {
        id: string;
        name: string;
    };
};

export type StorageLocationsResponse = {
    storageLocations: {
        data: StorageLocation[] | null;
        count: number;
        status: number;
        error: string | null;
    };
};

// ----------------------------------------
// STORAGE LOCATIONS
// ----------------------------------------

export const STORAGE_LOCATIONS_QUERY = `
  query StorageLocations(
    $where: StorageLocationWhereFilterInput
    $search: SearchInput
    $take: Int
    $skip: Int
    $orderBy: OrderByInputStorageLocation
  ) {
    storageLocations(
      where: $where
      search: $search
      take: $take
      skip: $skip
      orderBy: $orderBy
    ) {
      data {
        id
        laboratoryId

        code
        name
        type
        description

        maxVolumeCm3
        maxAreaCm2
        maxWeightG

        sampleCount
        usedAreaCm2
        occupancy

        supportsColdStorage
        supportsLightProtection
        supportsHazardous

        laboratory {
          id
          name
        }
      }

      count
      status
      error
    }
  }
`;

// ----------------------------------------
// STORAGE LOCATION DETAIL TYPES
// ----------------------------------------

export type StorageLocationDetail = {
    id: string;
    laboratoryId: number;

    code: string;
    name: string;
    type: string;
    description: string | null;

    maxVolumeCm3: number | null;
    maxAreaCm2: number | null;
    maxWeightG: number | null;

    sampleCount: number;
    usedAreaCm2: number;
    occupancy: number;

    supportsColdStorage: boolean;
    supportsLightProtection: boolean;
    supportsHazardous: boolean;

    laboratory: {
        id: string;
        name: string;
    };

    samples: {
        id: string;
        code: string;
        name: string;

        weightG: number;
        volumeCm3: number;
        areaCm2: number;

        status: string;

        materialType: {
            id: string;
            name: string;
        };
    }[];
};

export type StorageLocationResponse = {
    storageLocation: StorageLocationDetail | null;
};

// ----------------------------------------
// STORAGE LOCATION DETAIL
// ----------------------------------------

export const STORAGE_LOCATION_QUERY = `
  query StorageLocation($id: Int!) {
    storageLocation(id: $id) {
      id
      laboratoryId

      code
      name
      type
      description

      maxVolumeCm3
      maxAreaCm2
      maxWeightG

      sampleCount
      usedAreaCm2
      occupancy

      supportsColdStorage
      supportsLightProtection
      supportsHazardous

      laboratory {
        id
        name
      }

      samples {
        id
        code
        name

        weightG
        volumeCm3
        areaCm2

        status

        materialType {
          id
          name
        }
      }
    }
  }
`;

// ----------------------------------------
// CREATE STORAGE LOCATION
// ----------------------------------------

export type CreateStorageLocationResponse = {
    createStorageLocation: {
        id: string;
    } | null;
};

export const CREATE_STORAGE_LOCATION_MUTATION = `
  mutation CreateStorageLocation(
    $data: StorageLocationCreateInput
  ) {
    createStorageLocation(data: $data) {
      id
    }
  }
`;

// ----------------------------------------
// UPDATE STORAGE LOCATION
// ----------------------------------------

export type UpdateStorageLocationResponse = {
    updateStorageLocation: {
        id: string;
    } | null;
};

export const UPDATE_STORAGE_LOCATION_MUTATION = `
  mutation UpdateStorageLocation(
    $where: StorageLocationWhereUniqueInput!
    $data: StorageLocationUpdateInput
  ) {
    updateStorageLocation(
      where: $where
      data: $data
    ) {
      id
    }
  }
`;