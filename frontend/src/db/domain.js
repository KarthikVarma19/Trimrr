// Base URL that short links are built on. Point this at the Spring Boot
// backend's public host (e.g. "https://api.trimrr.app/" or
// "http://localhost:8080/"), because the backend owns the redirect:
// it performs the server-side 302 and records analytics.
//
// Falls back to the current origin so the app still renders in dev if the
// env var is unset.
export const domainUrl =
  import.meta.env.VITE_DOMAIN_URL ||
  (typeof window !== "undefined" ? `${window.location.origin}/` : "/");
