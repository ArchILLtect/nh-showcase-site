const DEFAULT_AUTH_API_BASE_URL = "https://u7fyurbrjc.execute-api.us-east-2.amazonaws.com";

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

export const AUTH_API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_AUTH_API_BASE_URL || DEFAULT_AUTH_API_BASE_URL,
);
