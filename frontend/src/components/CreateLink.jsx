import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import Error from "./Error.jsx";
import { Plus } from "lucide-react";

import * as yup from "yup";
import { QRCode } from "react-qrcode-logo";
import useFetch from "@/hooks/useFetch";
import { createUrl } from "@/db/apiUrls.js";
import { BeatLoader } from "react-spinners";
import { domainUrl } from "@/db/domain.js";

const CreateLink = () => {
  const navigate = useNavigate();
  let [searchParms, setSearchParams] = useSearchParams();
  const longLink = searchParms.get("createNew");

  const [errors, setErrors] = useState([]);

  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, formValues);

  useEffect(() => {
    // Backend returns the created link as a single object.
    if (error === null && data) {
      navigate(`/link/${data.id}`);
    }
  }, [error, data]);

  // Accept bare domains (example.com) by defaulting to https:// — matches how
  // real shorteners behave, instead of rejecting anything without a scheme.
  const normalizeUrl = (value) => {
    const v = (value || "").trim();
    if (!v) return v;
    return /^https?:\/\//i.test(v) ? v : `https://${v}`;
  };

  const createNewLink = async () => {
    setErrors([]);
    try {
      const payload = { ...formValues, longUrl: normalizeUrl(formValues.longUrl) };
      await schema.validate(payload, { abortEarly: false });
      // The backend generates the short code and QR image.
      await fnCreateUrl(payload);
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Create link
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        aria-describedby={"dialog-description"}
      >
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            Create a short link
          </DialogTitle>
        </DialogHeader>

        {formValues?.longUrl && (
          <div className="flex justify-center rounded-lg border border-border bg-white p-3">
            <QRCode
              value={formValues?.longUrl}
              size={200}
              logoImage="./logo.png"
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm text-muted-foreground">
            Title
          </label>
          <Input
            id="title"
            placeholder="e.g. Portfolio site"
            value={formValues.title}
            onChange={handleChange}
          />
          {errors?.title && <Error message={errors.title} />}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="longUrl" className="text-sm text-muted-foreground">
            Long URL
          </label>
          <Input
            id="longUrl"
            placeholder="https://example.com/very/long/path"
            value={formValues.longUrl}
            onChange={handleChange}
          />
          {errors?.longUrl && <Error message={errors.longUrl} />}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="customUrl" className="text-sm text-muted-foreground">
            Custom back-half <span className="text-xs">(optional)</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="shrink-0 rounded-md border border-border bg-secondary px-3 py-2 text-sm text-muted-foreground">
              {domainUrl}
            </span>
            <Input
              id="customUrl"
              placeholder="my-link"
              value={formValues.customUrl}
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={createNewLink} disabled={loading}>
            {loading ? <BeatLoader size={8} color="currentColor" /> : "Create link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
