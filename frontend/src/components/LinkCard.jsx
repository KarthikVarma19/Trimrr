import { Link } from "react-router-dom";
import { Button } from "./ui/button.jsx";
import { Check, Copy, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import useFetch from "@/hooks/useFetch.js";
import { deleteUrl } from "@/db/apiUrls.js";
import { BeatLoader } from "react-spinners";

import { domainUrl } from "@/db/domain.js";

const LinkCard = ({ url, fetchUrls }) => {
  const [copied, setCopied] = useState(false);

  const code = url?.custom_url ? url.custom_url : url?.short_url;
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
    document.body.removeChild(anchor);
  };

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url?.id);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 sm:flex-row sm:items-center">
      <img
        src={url?.qr}
        alt={`QR code for ${url?.title}`}
        className="h-24 w-24 shrink-0 rounded-lg border border-border bg-white object-contain p-1"
      />

      <Link
        to={`/link/${url?.id}`}
        className="flex min-w-0 flex-1 flex-col gap-1"
      >
        <span className="truncate text-lg font-medium hover:text-primary">
          {url?.title}
        </span>
        <span className="truncate text-sm font-medium text-primary">
          {domainUrl}
          {code}
        </span>
        <span className="truncate text-sm text-muted-foreground">
          {url?.original_url}
        </span>
        <span className="mt-1 text-xs text-muted-foreground">
          {new Date(url?.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </Link>

      <div className="flex items-center gap-1 self-start sm:self-center">
        <Button
          variant="ghost"
          size="icon"
          title="Copy short link"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-4 w-4 text-primary" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title="Download QR code"
          onClick={downloadImage}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title="Delete link"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => fnDelete().then(() => fetchUrls())}
        >
          {loadingDelete ? (
            <BeatLoader size={5} color="currentColor" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
