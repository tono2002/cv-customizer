"use client";

import { useState, useCallback } from "react";
import { DropZone } from "./DropZone";
import { GenerateButton } from "./GenerateButton";
import { ProgressSteps } from "./ProgressSteps";
import { CVPreview } from "./CVPreview";
import { ErrorBanner } from "./ErrorBanner";
import type { UploadedFile, GenerateErrorResponse, StreamEvent } from "@/lib/types";

type Status = "idle" | "loading" | "success" | "error";

function triggerDownload(base64: string, filename: string) {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function CVCustomizer() {
  const [cvFile, setCvFile] = useState<UploadedFile | null>(null);
  const [linkedinFile, setLinkedinFile] = useState<UploadedFile | null>(null);
  const [jobOffer, setJobOffer] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);
  const [progressStep, setProgressStep] = useState<number>(0);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);

  const canGenerate = !!cvFile && jobOffer.trim().length >= 10;

  const handleGenerate = useCallback(async () => {
    if (!cvFile) return;
    setStatus("loading");
    setError(null);
    setProgressStep(1);
    setPdfBase64(null);

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

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop()!;

        for (const line of lines) {
          if (!line.trim()) continue;
          const event: StreamEvent = JSON.parse(line);

          if (event.type === "progress") {
            setProgressStep(event.step);
          } else if (event.type === "done") {
            // Auto-download immediately — don't make the user click a button
            triggerDownload(event.pdf, "tailored-cv.pdf");
            setPdfBase64(event.pdf);
            setStatus("success");
          } else if (event.type === "error") {
            setError({ message: event.error, details: event.details });
            setStatus("error");
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error — please try again.";
      setError({ message });
      setStatus("error");
    }
  }, [cvFile, linkedinFile, jobOffer]);

  const handleGenerateAgain = useCallback(() => {
    setStatus("idle");
    setError(null);
    setProgressStep(0);
    setPdfBase64(null);
  }, []);

  const isLoading = status === "loading";

  return (
    <div className="flex flex-col gap-6">
      {status !== "success" && (
        <>
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

          {status === "error" && error && (
            <ErrorBanner message={error.message} details={error.details} />
          )}

          <GenerateButton
            disabled={!canGenerate}
            loading={isLoading}
            onClick={handleGenerate}
          />

          {isLoading && <ProgressSteps currentStep={progressStep} />}

          {!cvFile && !isLoading && (
            <p className="text-center text-xs text-gray-400">
              Upload your CV and paste a job offer to get started.
            </p>
          )}
        </>
      )}

      {status === "success" && pdfBase64 && (
        <CVPreview
          pdfBase64={pdfBase64}
          onDownloadAgain={() => triggerDownload(pdfBase64, "tailored-cv.pdf")}
          onGenerateAgain={handleGenerateAgain}
        />
      )}
    </div>
  );
}
