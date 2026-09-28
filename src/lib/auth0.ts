import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  signInReturnToPath: "/dashboard",

  authorizationParameters: {
    audience: "https://api.optilab.com",
    scope: "openid profile email offline_access",
  },
});