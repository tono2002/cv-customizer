"use client";

import { useMemo, useEffect } from "react";
import type { Mode } from "@/lib/types";

interface Props {
  pdfBase64: string;
  mode: Mode;
  onDownloadAgain: () => void;
  onGenerateAgain: () => void;
}

export function CVPreview({ pdfBase64, mode, onDownloadAgain, onGenerateAgain }: Props) {
  const isCoverLetter = mode === "cover-letter";
  const blobUrl = useMemo(() => {
    const bytes = Uint8Array.from(atob(pdfBase64), (c) => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: "application/pdf" });
    return URL.createObjectURL(blob);
  }, [pdfBase64]);

  useEffect(() => {
    return () => URL.revokeObjectURL(blobUrl);
  }, [blobUrl]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <svg className="h-5 w-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-sm font-semibold text-white">
          {isCoverLetter ? "Cover letter downloaded. Here's a preview" : "CV downloaded. Here's a preview"}
        </h2>
      </div>

      <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-white/5">
        <iframe
          src={blobUrl}
          title="CV preview"
          className="w-full"
          style={{ height: "842px" }}
          aria-label={isCoverLetter ? "PDF preview of your cover letter" : "PDF preview of your tailored CV"}
        />
      </div>

      <p className="text-xs text-white/40">
        Your PDF was downloaded automatically. Use the buttons below to download again or start over.
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onDownloadAgain}
          className="btn-glass flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05050F]"
        >
          Download again
        </button>
        <button
          type="button"
          onClick={onGenerateAgain}
          className="btn-gradient flex-1 rounded-xl px-6 py-3.5 text-sm font-semibold text-white active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05050F]"
        >
          Generate again
        </button>
      </div>
    </div>
  );
}
