import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import { getUrls } from "@/db/apiUrls";
import { UrlState } from "@/Context/context";
import { getClicksForUrls } from "@/db/apiClicks";
import LinkCard from "@/components/LinkCard";
import CreateLink from "@/components/CreateLink";

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
    <div>
      {(loading || loadingClicks) && (
        <BarLoader width={"100%"} color="#36d7b7" />
      )}

      <div className="grid grid-cols-2 gap-4 py-3">
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.length || 0}</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between py-3">
        <h1 className="text-4xl font-extrabold">My Links</h1>
        {/* <Button>Create Link</Button> */}
        <CreateLink />
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Filter Links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute top-2 right-2 p-1" />
      </div>
      {error && <Error message={error?.message} />}
      {(filteredUrls || []).map((url, i) => {
        return <LinkCard key={i} url={url} fetchUrls={fnUrls} />;
      })}
    </div>
  );
};

export default Dashboard;
