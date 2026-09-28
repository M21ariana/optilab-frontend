const getGraphQLUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_GRAPHQL_URL is not configured in the environment variables."
    );
  }

  return url;
};

type GraphQLError = {
  message: string;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLError[];
};

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
  accessToken?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers.Authorization =
      `Bearer ${accessToken}`;
  }

  const response = await fetch(
    getGraphQLUrl(),
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: "no-store",
    }
  );

 if (!response.ok) {
  const errorBody = await response.text();

  throw new Error(
    `GraphQL request failed with status ${response.status}: ${errorBody}`
  );
}

  const result: GraphQLResponse<T> =
    await response.json();

  if (result.errors?.length) {
    throw new Error(
      result.errors
        .map((error) => error.message)
        .join(", ")
    );
  }

  if (!result.data) {
    throw new Error(
      "GraphQL response did not contain data."
    );
  }

  return result.data;
}