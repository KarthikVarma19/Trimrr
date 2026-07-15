import { api } from "@/lib/api.js";

// All URL data now goes through the Spring Boot backend, which enforces
// per-user ownership from the Supabase JWT. The backend also generates the
// short code and the QR image, so the frontend no longer talks to the
// database or storage for links.

export async function getUrls() {
  // User is derived from the JWT on the backend; no id needed.
  return api.get("/api/urls");
}

export async function deleteUrl(id) {
  return api.del(`/api/urls/${id}`);
}

export async function createUrl(formValues, override) {
  // useFetch calls this as createUrl(options, ...args); CreateLink passes the
  // normalized payload as the arg, so prefer it over the captured options.
  const { title, longUrl, customUrl } = override || formValues;
  return api.post("/api/urls", {
    title,
    long_url: longUrl,
    custom_url: customUrl || null,
  });
}

export async function getUrl({ id }) {
  return api.get(`/api/urls/${id}`);
}
