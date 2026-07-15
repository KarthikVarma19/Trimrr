import supabase from "@/db/supabase.js";

// Base URL of the Spring Boot backend. All application data (links + analytics)
// goes through here; Supabase is used only for authentication.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Attach the current Supabase session's access token so the backend can verify
// the user (it validates this JWT with the Supabase JWT secret).
async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, { method = "GET", body } = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(await authHeaders()),
  };

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      data?.message || data?.error || `Request failed (${res.status})`
    );
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  del: (path) => request(path, { method: "DELETE" }),
};
