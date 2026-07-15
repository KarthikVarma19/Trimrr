import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { domainUrl } from "@/db/domain.js";

/**
 * Legacy fallback route. Short links now resolve directly on the Spring Boot
 * backend, which performs the real server-side 302 redirect and records
 * analytics. If someone lands on the SPA's /:id path (e.g. an old link
 * pointing at the frontend host), we simply hand off to the backend rather
 * than doing the redirect + click-logging in the browser.
 */
const RedirectLink = () => {
  const { id } = useParams();

  useEffect(() => {
    window.location.replace(`${domainUrl}${id}`);
  }, [id]);

  return (
    <div className="flex flex-col items-center gap-4 py-24">
      <BarLoader width={160} height={3} color="oklch(0.755 0.115 173)" />
      <p className="text-sm text-muted-foreground">Redirecting…</p>
    </div>
  );
};

export default RedirectLink;
