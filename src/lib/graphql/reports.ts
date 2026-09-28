// ----------------------------------------
// TYPES
// ----------------------------------------

export type ReportsSummary = {
  overallOccupancy: number;
  activeSamples: number;
  movementsLast30Days: number;
  criticalAlerts: number;
};

export type ReportOccupancyByLocation = {
  locationId: number;
  code: string;
  name: string;

  usedAreaCm2: number;
  maxAreaCm2: number;
  occupancy: number;
};

export type ReportSamplesByMaterialType = {
  materialTypeId: number;
  name: string;
  count: number;
};

export type ReportMovementTrend = {
  date: string;
  count: number;
};

export type ReportInventoryFlow = {
  movementType: string;
  count: number;
};

export type ReportExpiration = {
  range:
    | "EXPIRED"
    | "NEXT_7_DAYS"
    | "NEXT_30_DAYS"
    | "LATER";

  count: number;
};

export type ReportCriticalLocation = {
  locationId: number;
  code: string;
  name: string;
  occupancy: number;
  sampleCount: number;
};

export type ReportsDashboard = {
  summary: ReportsSummary;

  occupancyByLocation:
    ReportOccupancyByLocation[];

  samplesByMaterialType:
    ReportSamplesByMaterialType[];

  movementTrend:
    ReportMovementTrend[];

  inventoryFlow:
    ReportInventoryFlow[];

  expirations:
    ReportExpiration[];

  criticalLocations:
    ReportCriticalLocation[];
};

export type ReportsDashboardResponse = {
  reportsDashboard: ReportsDashboard;
};

// ----------------------------------------
// REPORTS DASHBOARD
// ----------------------------------------

export const REPORTS_DASHBOARD_QUERY = `
  query ReportsDashboard {
    reportsDashboard {
      summary {
        overallOccupancy
        activeSamples
        movementsLast30Days
        criticalAlerts
      }

      occupancyByLocation {
        locationId
        code
        name
        usedAreaCm2
        maxAreaCm2
        occupancy
      }

      samplesByMaterialType {
        materialTypeId
        name
        count
      }

      movementTrend {
        date
        count
      }

      inventoryFlow {
        movementType
        count
      }

      expirations {
        range
        count
      }

      criticalLocations {
        locationId
        code
        name
        occupancy
        sampleCount
      }
    }
  }
`;