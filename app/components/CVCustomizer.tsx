"use client";

import { useState, useCallback, useEffect } from "react";
import { DropZone } from "./DropZone";
import { GenerateButton } from "./GenerateButton";
import { ModeToggle } from "./ModeToggle";
import { ProgressSteps } from "./ProgressSteps";
import { CVPreview } from "./CVPreview";
import { ErrorBanner } from "./ErrorBanner";
import type { UploadedFile, GenerateErrorResponse, StreamEvent, Mode } from "@/lib/types";

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

async function saveFileToProfile(fileType: "cv" | "linkedin", file: UploadedFile) {
  await fetch("/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileType, base64: file.base64, filename: file.name }),
  });
}

async function base64FromUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

export function CVCustomizer() {
  const [cvFile, setCvFile] = useState<UploadedFile | null>(null);
  const [linkedinFile, setLinkedinFile] = useState<UploadedFile | null>(null);
  const [mode, setMode] = useState<Mode>("cv");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);
  const [progressStep, setProgressStep] = useState<number>(0);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Load saved files from profile on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) return;
        const { profile } = await res.json();
        if (!profile) return;

        if (profile.cvSignedUrl && profile.cvFilename) {
          const base64 = await base64FromUrl(profile.cvSignedUrl);
          setCvFile({ name: profile.cvFilename, base64, mediaType: "application/pdf", sizeBytes: 0 });
        }
        if (profile.linkedinSignedUrl && profile.linkedinFilename) {
          const base64 = await base64FromUrl(profile.linkedinSignedUrl);
          setLinkedinFile({ name: profile.linkedinFilename, base64, mediaType: "application/pdf", sizeBytes: 0 });
        }
      } catch {
        // Profile load failure is non-fatal — user can still upload manually
      } finally {
        setProfileLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleCvFile = useCallback((file: UploadedFile | null) => {
    setCvFile(file);
    if (file) saveFileToProfile("cv", file);
  }, []);

  const handleLinkedinFile = useCallback((file: UploadedFile | null) => {
    setLinkedinFile(file);
    if (file) saveFileToProfile("linkedin", file);
  }, []);

  const [jobOffer, setJobOffer] = useState("");
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
        mode,
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
            const filename = mode === "cover-letter" ? "cover-letter.pdf" : "tailored-cv.pdf";
            triggerDownload(event.pdf, filename);
            setPdfBase64(event.pdf);
            setStatus("success");
          } else if (event.type === "error") {
            setError({ message: event.error, details: event.details });
            setStatus("error");
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error. Please try again.";
      setError({ message });
      setStatus("error");
    }
  }, [cvFile, linkedinFile, jobOffer, mode]);

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
          <ModeToggle mode={mode} onChange={setMode} disabled={isLoading} />

          <div className="grid gap-5 sm:grid-cols-2">
            <DropZone
              id="cv-upload"
              label="Current CV (PDF)"
              file={cvFile}
              onFile={handleCvFile}
              disabled={isLoading || profileLoading}
              savedToProfile={!profileLoading && !!cvFile}
            />
            <DropZone
              id="linkedin-upload"
              label="LinkedIn Export (PDF)"
              hint="Shorter/recent exports work best. Full exports can be 10–30 pages and cost more to process."
              file={linkedinFile}
              onFile={handleLinkedinFile}
              disabled={isLoading || profileLoading}
              savedToProfile={!profileLoading && !!linkedinFile}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="job-offer" className="text-sm font-medium text-white/70">
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
                "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 resize-y transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                isLoading ? "opacity-50 cursor-not-allowed" : "hover:border-white/20",
              ].join(" ")}
            />
            {!canGenerate && jobOffer.length > 0 && jobOffer.trim().length < 10 && (
              <p className="text-xs text-amber-400">Please paste a more complete job description.</p>
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

          {!cvFile && !isLoading && !profileLoading && (
            <p className="text-center text-xs text-white/40">
              Upload your CV and paste a job offer to get started.
            </p>
          )}
        </>
      )}

      {status === "success" && pdfBase64 && (
        <CVPreview
          pdfBase64={pdfBase64}
          mode={mode}
          onDownloadAgain={() => triggerDownload(pdfBase64, mode === "cover-letter" ? "cover-letter.pdf" : "tailored-cv.pdf")}
          onGenerateAgain={handleGenerateAgain}
        />
      )}
    </div>
  );
}
