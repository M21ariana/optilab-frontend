export const ME_QUERY = `
  query Me {
    me {
      id
      fullName
      email
      role
      organization {
        id
        name
      }
    }
  }
`;

export const UPDATE_MY_PROFILE_MUTATION = `
  mutation UpdateMyProfile($fullName: String!) {
    updateMyProfile(fullName: $fullName) {
      id
      fullName
      email
      role
      organization {
        id
        name
      }
    }
  }
`;

export type CurrentUser = {
  id: string;
  fullName: string | null;
  email: string;
  role: string | null;
  organization: {
    id: string;
    name: string;
  } | null;
};

export type MeResponse = {
  me: CurrentUser | null;
};

export type UpdateMyProfileResponse = {
  updateMyProfile: CurrentUser;
};