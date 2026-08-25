import { graphqlRequest } from "../client";

export type Organization = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type OrganizationsResponse = {
  organizations: {
    data: Organization[];
    count: number;
    status: number;
    error?: string | null;
  };
};

const GET_ORGANIZATIONS = `
  query Organizations {
    organizations {
      data {
        id
        name
        createdAt
        updatedAt
      }
      count
      status
      error
    }
  }
`;

export async function getOrganizations() {
  const response = await graphqlRequest<OrganizationsResponse>(
    GET_ORGANIZATIONS
  );

  return response.organizations;
}