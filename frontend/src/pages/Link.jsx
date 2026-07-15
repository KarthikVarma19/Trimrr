import { Button } from "@/components/ui/button";
import { UrlState } from "@/Context/context";
import { getClicksForUrl } from "@/db/apiClicks";
import { deleteUrl, getUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";
import { Check, Copy, Download, ExternalLink, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LocationStats from "@/components/LocationStats";
import DeviceStats from "@/components/DeviceStats";

import { domainUrl } from "@/db/domain";

const Link = () => {
  const [copied, setCopied] = useState(false);
  const { id } = useParams();
  const { user } = UrlState();
  const navigate = useNavigate();

  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrl, { id, user_id: user?.id });
  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
    fnStats();
  }, []);

  if (error) {
    navigate("/dashboard");
  }

  const code = url?.custom_url ? url?.custom_url : url?.short_url;
  const shortLink = `${domainUrl}${code}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const downloadImage = () => {
    const imageUrl = url?.qr;
    const filename = url?.title;
    if (!imageUrl || !filename) return;

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = `${filename}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  return (
    <div className="flex flex-col gap-8 py-8">
      {(loading || loadingStats) && (
        <BarLoader width="100%" height={2} color="oklch(0.755 0.115 173)" />
      )}

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Link details */}
        <div className="flex flex-col gap-6 lg:w-2/5">
          <div>
            <h1 className="font-serif text-4xl tracking-tight">{url?.title}</h1>
            <a
              href={shortLink}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block truncate text-xl font-medium text-primary hover:underline"
            >
              {domainUrl}
              {code}
            </a>
            <a
              href={url?.original_url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center gap-1.5 truncate text-sm text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{url?.original_url}</span>
            </a>
            <p className="mt-3 text-xs text-muted-foreground">
              Created{" "}
              {url?.created_at &&
                new Date(url.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              {copied ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button variant="outline" size="sm" onClick={downloadImage}>
              <Download className="h-4 w-4" />
              QR
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => fnDelete().then(() => navigate("/dashboard"))}
            >
              {loadingDelete ? (
                <BeatLoader size={5} color="currentColor" />
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </div>

          {url?.qr && (
            <img
              src={url.qr}
              alt="QR code"
              className="w-full max-w-xs self-center rounded-xl border border-border bg-white object-contain p-3 lg:self-start"
            />
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-4 lg:w-3/5">
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Total clicks</p>
            <p className="mt-2 font-serif text-5xl tracking-tight">
              {stats?.length || 0}
            </p>
          </div>

          {stats && stats.length ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LocationStats stats={stats} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Devices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DeviceStats stats={stats} />
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              {loadingStats === false
                ? "No clicks recorded yet."
                : "Loading statistics…"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Link;
