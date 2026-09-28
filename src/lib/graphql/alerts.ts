// ----------------------------------------
// TYPES
// ----------------------------------------

export type AlertType =
  | "EXPIRATION"
  | "EXPIRATION_WARNING"
  | "STORAGE_REQUIREMENT"
  | "HAZARDOUS_MATERIAL"
  | "HIGH_OCCUPANCY";

export type AlertSeverity =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export type Alert = {
  id: string;

  laboratoryId: number | null;
  storageLocationId: number | null;
  sampleId: number | null;

  alertType: AlertType;
  severity: AlertSeverity;
  message: string;

  isResolved: boolean;
  resolvedAt: string | null;

  createdAt: string | null;
  updatedAt: string | null;

  laboratory: {
    id: string;
    name: string;
  } | null;

  storageLocation: {
    id: string;
    code: string;
    name: string;
    type: string;
    occupancy: number;
  } | null;

  sample: {
    id: string;
    code: string;
    name: string;
    expirationDate: string | null;

    materialType: {
      id: string;
      name: string;
    };
  } | null;
};

export type AlertsResponse = {
  alerts: {
    data: Alert[] | null;
    count: number;
    status: number;
    error: string | null;
  };
};

// ----------------------------------------
// ALERTS
// ----------------------------------------

export const ALERTS_QUERY = `
  query Alerts(
    $where: AlertWhereFilterInput
    $search: SearchInput
    $take: Int
    $skip: Int
    $orderBy: OrderByInputAlert
  ) {
    alerts(
      where: $where
      search: $search
      take: $take
      skip: $skip
      orderBy: $orderBy
    ) {
      data {
        id

        laboratoryId
        storageLocationId
        sampleId

        alertType
        severity
        message

        isResolved
        resolvedAt

        createdAt
        updatedAt

        laboratory {
          id
          name
        }

        storageLocation {
          id
          code
          name
          type
          occupancy
        }

        sample {
          id
          code
          name
          expirationDate

          materialType {
            id
            name
          }
        }
      }

      count
      status
      error
    }
  }
`;

// ----------------------------------------
// SINGLE ALERT
// ----------------------------------------

export type AlertResponse = {
  alert: Alert | null;
};

export const ALERT_QUERY = `
  query Alert($id: Int!) {
    alert(id: $id) {
      id

      laboratoryId
      storageLocationId
      sampleId

      alertType
      severity
      message

      isResolved
      resolvedAt

      createdAt
      updatedAt

      laboratory {
        id
        name
      }

      storageLocation {
        id
        code
        name
        type
        occupancy
      }

      sample {
        id
        code
        name
        expirationDate

        materialType {
          id
          name
        }
      }
    }
  }
`;