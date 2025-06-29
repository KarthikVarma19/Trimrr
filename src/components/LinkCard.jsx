import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Copy, Download, Trash } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";

import { domainUrl } from "@/db/domain";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const LinkCard = ({ url, fetchUrls }) => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const filename = url?.title;

    if (imageUrl && filename) {
      const anchor = document.createElement("a");
      anchor.href = imageUrl;
      anchor.download = `${filename}.png`;

      document.body.appendChild(anchor);
      anchor.click();

      document.body.removeChild(anchor);
    } else {
      console.error("Image URL or filename is missing.");
    }
  };

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url?.id);

  return (
    <div className="flex flex-col md:flex-row gap-5 border p-1 bg-gray-900 rounded-lg my-2">
      <img
        src={url?.qr}
        alt="qr code"
        className="h-32 w-32 object-contain ring ring-blue-300 self-start "
        style={{ borderRadius: "10px" }}
      />
      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1">
        <span className="text-3xl font-extrabold hover:underline cursor-pointer">
          {url?.title}
        </span>
        <span className="text-2xl text-blue-400 font-bold hover:underline cursor-pointer">
          {domainUrl}
          {url?.custom_url ? url?.custom_url : url.short_url}
        </span>
        <span className="flex items-center gap-1 hover:underline cursor-pointer">
          {url?.original_url}
        </span>
        <span className="flex items-end font-extralight text-sm flex-1">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>
      <div className="flex gap-2 items-center">
        <HoverCard>
          <HoverCardTrigger>
            <Button
              variant="ghost"
              className="p-1 cursor-pointer"
              onClick={() =>
                navigator.clipboard.writeText(`${domainUrl}${url?.short_url}`)
              }
            >
              <Copy />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="text-xs p-1 bg-gray-800 rounded w-auto ">
            Copy
          </HoverCardContent>
        </HoverCard>

        <HoverCard>
          <HoverCardTrigger>
            <Button
              variant="ghost"
              className="p-1 cursor-pointer"
              onClick={downloadImage}
            >
              <Download />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="text-xs p-1 bg-gray-800 rounded w-auto ">
            Download
          </HoverCardContent>
        </HoverCard>

        <HoverCard>
          <HoverCardTrigger>
            <Button
              variant="ghost"
              className=" p-1 cursor-pointer"
              onClick={() => fnDelete().then(() => fetchUrls())}
            >
              {loadingDelete ? (
                <BeatLoader size={5} color="white" />
              ) : (
                <Trash />
              )}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="text-xs p-1 bg-gray-800 rounded w-auto">
            Delete
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
};

export default LinkCard;
