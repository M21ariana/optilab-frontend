export type InternalLocation = {
  code: string;
  name: string;
  samples: number;
  capacity: number;
  occupancy: number;
};

export type StorageUnit = {
  id: string;
  name: string;
  type: string;
  description: string;
  allowedTypes: string[];
  sampleCount: number;
  occupiedSpaces: number;
  totalSpaces: number;
  occupancy: number;
  locations: InternalLocation[];
};