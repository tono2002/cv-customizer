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
        <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-sm font-semibold text-gray-900">
          {isCoverLetter ? "Cover letter downloaded — here's a preview" : "CV downloaded — here's a preview"}
        </h2>
      </div>

      <div className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
        <iframe
          src={blobUrl}
          title="CV preview"
          className="w-full"
          style={{ height: "842px" }}
          aria-label={isCoverLetter ? "PDF preview of your cover letter" : "PDF preview of your tailored CV"}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onDownloadAgain}
          className="flex-1 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
        >
          Download again
        </button>
        <button
          type="button"
          onClick={onGenerateAgain}
          className="flex-1 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Generate again
        </button>
      </div>
    </div>
  );
}
