export type SampleStatus = "ACTIVE" | "ARCHIVED";

export type SampleData = {
  id?: string;

  name: string;
  code: string;
  type: string;
  description: string;

  weight: string;
  volume: string;
  area: string;

  entryDate: string;
  expirationDate: string;

  status: SampleStatus;

  locationId: string;
  locationCode: string;
  locationName: string;
};

export type StorageLocationOption = {
  id: string;
  code: string;
  name: string;

  allowedTypes: string[];

  availableVolume: number;
  availableArea: number;
  availableWeight: number;

  occupancy: number;
};