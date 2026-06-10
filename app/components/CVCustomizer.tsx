"use client";

import { useState, useCallback } from "react";
import { DropZone } from "./DropZone";
import { GenerateButton } from "./GenerateButton";
import { SuccessBanner } from "./SuccessBanner";
import { ErrorBanner } from "./ErrorBanner";
import type { UploadedFile, GenerateErrorResponse } from "@/lib/types";

type Status = "idle" | "loading" | "success" | "error";

export function CVCustomizer() {
  const [cvFile, setCvFile] = useState<UploadedFile | null>(null);
  const [linkedinFile, setLinkedinFile] = useState<UploadedFile | null>(null);
  const [jobOffer, setJobOffer] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);

  const canGenerate = !!cvFile && jobOffer.trim().length >= 10;

  const handleGenerate = useCallback(async () => {
    if (!cvFile) return;
    setStatus("loading");
    setError(null);

    try {
      const body = {
        cvBase64: cvFile.base64,
        cvMediaType: cvFile.mediaType,
        ...(linkedinFile
          ? { linkedinBase64: linkedinFile.base64, linkedinMediaType: linkedinFile.mediaType }
          : {}),
        jobOffer: jobOffer.trim(),
      };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const json: GenerateErrorResponse = await res.json();
        setError({ message: json.error, details: json.details });
        setStatus("error");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tailored-cv.pdf";
      a.click();
      URL.revokeObjectURL(url);

      setStatus("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error — please try again.";
      setError({ message });
      setStatus("error");
    }
  }, [cvFile, linkedinFile, jobOffer]);

  const handleGenerateAgain = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  const isLoading = status === "loading";

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <DropZone
          id="cv-upload"
          label="Current CV (PDF)"
          file={cvFile}
          onFile={setCvFile}
          disabled={isLoading}
        />
        <DropZone
          id="linkedin-upload"
          label="LinkedIn Export (PDF)"
          hint="Shorter/recent exports work best — full exports can be 10–30 pages and cost more to process."
          file={linkedinFile}
          onFile={setLinkedinFile}
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="job-offer" className="text-sm font-medium text-gray-700">
          Job offer
        </label>
        <textarea
          id="job-offer"
          rows={10}
          placeholder="Paste the full job description here…"
          value={jobOffer}
          onChange={(e) => setJobOffer(e.target.value)}
          disabled={isLoading}
          className={[
            "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-y transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:border-gray-300",
          ].join(" ")}
        />
        {!canGenerate && jobOffer.length > 0 && jobOffer.trim().length < 10 && (
          <p className="text-xs text-amber-600">Please paste a more complete job description.</p>
        )}
      </div>

      {status === "success" && <SuccessBanner onGenerateAgain={handleGenerateAgain} />}
      {status === "error" && error && (
        <ErrorBanner message={error.message} details={error.details} />
      )}

      <GenerateButton
        disabled={!canGenerate}
        loading={isLoading}
        onClick={handleGenerate}
      />

      {!cvFile && (
        <p className="text-center text-xs text-gray-400">
          Upload your CV and paste a job offer to get started.
        </p>
      )}
    </div>
  );
}
