import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

import { Input } from "@/components/ui/input";
import { Link2, MousePointerClick, Search } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { getUrls } from "@/db/apiUrls";
import { UrlState } from "@/Context/context";
import { getClicksForUrls } from "@/db/apiClicks";
import LinkCard from "@/components/LinkCard";
import CreateLink from "@/components/CreateLink";
import Error from "@/components/Error";

const StatCard = ({ icon, label, value }) => {
  const Icon = icon;
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>
      <p className="mt-3 font-serif text-4xl tracking-tight">{value}</p>
    </div>
  );
};

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = UrlState();
  const {
    loading,
    error,
    data: urls,
    fn: fnUrls,
  } = useFetch(getUrls, user?.id);

  const {
    loading: loadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(
    getClicksForUrls,
    urls?.map((url) => url.id)
  );

  useEffect(() => {
    fnUrls();
  }, []);

  useEffect(() => {
    if (urls?.length) {
      fnClicks();
    }
  }, [urls?.length]);

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 py-8">
      {(loading || loadingClicks) && (
        <BarLoader width="100%" height={2} color="oklch(0.755 0.115 173)" />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard icon={Link2} label="Links created" value={urls?.length || 0} />
        <StatCard
          icon={MousePointerClick}
          label="Total clicks"
          value={clicks?.length || 0}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl tracking-tight">My links</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage, copy, and track every short link you&rsquo;ve created.
          </p>
        </div>
        <CreateLink />
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Filter links by title…"
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error && <Error message={error?.message} />}

      <div className="flex flex-col gap-3">
        {(filteredUrls || []).map((url) => (
          <LinkCard key={url.id} url={url} fetchUrls={fnUrls} />
        ))}

        {!loading && filteredUrls?.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <p className="font-serif text-xl">
              {urls?.length ? "No links match your filter." : "No links yet."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {urls?.length
                ? "Try a different search term."
                : "Create your first short link to get started."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
