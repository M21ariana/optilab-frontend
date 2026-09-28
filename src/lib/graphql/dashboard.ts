// ======================================================
// QUERY
// ======================================================

export const DASHBOARD_QUERY = `
  query Dashboard(
    $laboratoryId: Int
  ) {
    dashboard(
      laboratoryId: $laboratoryId
    ) {
      scope
      laboratoryId

      activeSamples
      samplesCreatedThisMonth

      totalAreaCm2
      usedAreaCm2
      availableAreaCm2
      areaUsagePercentage

      pendingAlerts
      criticalAlerts

      movementsToday

      laboratoryCount
      materialTypeCount

      recentActivity {
        id
        type
        title
        description
        createdAt
      }
    }
  }
`;

// ======================================================
// DASHBOARD SCOPE
// ======================================================

export type DashboardScope =
  | "ORGANIZATION"
  | "LABORATORY";

// ======================================================
// ACTIVITY
// ======================================================

export type DashboardActivityType =
  | "SAMPLE"
  | "MOVEMENT"
  | "ALERT"
  | "LOCATION";

export type DashboardActivity = {
  id: string;

  type: DashboardActivityType;

  title: string;

  description: string;

  createdAt: string;
};

// ======================================================
// DASHBOARD
// ======================================================

export type DashboardData = {
  scope: DashboardScope;

  laboratoryId: number | null;

  activeSamples: number;

  samplesCreatedThisMonth: number;

  totalAreaCm2: number;

  usedAreaCm2: number;

  availableAreaCm2: number;

  areaUsagePercentage: number;

  pendingAlerts: number;

  criticalAlerts: number;

  movementsToday: number;

  laboratoryCount: number;

  materialTypeCount: number;

  recentActivity: DashboardActivity[];
};

// ======================================================
// RESPONSE
// ======================================================

export type DashboardResponse = {
  dashboard: DashboardData;
};