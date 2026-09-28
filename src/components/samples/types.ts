export type SampleStatus =
  | "ACTIVE"
  | "ARCHIVED"
  | "DISCARDED"
  | "EXPIRED";

export type SampleData = {
  // ----------------------------------------
  // IDENTIFIERS
  // ----------------------------------------

  id?: string;

  laboratoryId?: number;

  materialTypeId?: number;

  // ----------------------------------------
  // GENERAL DATA
  // ----------------------------------------

  name: string;

  code: string;

  type: string;

  description: string;

  status: SampleStatus;

  // ----------------------------------------
  // PHYSICAL DATA
  // ----------------------------------------

  weight: string;

  volume: string;

  area: string;

  // ----------------------------------------
  // DATES
  // ----------------------------------------

  entryDate: string;

  expirationDate: string;

  // ----------------------------------------
  // STORAGE REQUIREMENTS
  // ----------------------------------------

  isStackable: boolean;

  maxStackUnits: number | null;

  requiresColdStorage: boolean;

  requiresLightProtection: boolean;

  isHazardous: boolean;

  // ----------------------------------------
  // LOCATION
  // ----------------------------------------

  locationId: string;

  locationCode: string;

  locationName: string;
};