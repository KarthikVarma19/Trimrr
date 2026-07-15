import { api } from "@/lib/api.js";

// Analytics reads go through the backend. Click *recording* now happens
// server-side during the redirect (com.trimrr.service.ClickService), so there
// is no longer any client-side click logging or geo/user-agent parsing here.

export async function getClicksForUrls() {
  // Returns every click across the current user's links (for dashboard totals).
  return api.get("/api/analytics/clicks");
}

export async function getClicksForUrl(url_id) {
  return api.get(`/api/urls/${url_id}/clicks`);
}
