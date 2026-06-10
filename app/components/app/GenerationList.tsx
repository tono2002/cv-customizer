"use client";

import { useState } from "react";
import { GenerationPreviewModal } from "./GenerationPreviewModal";

export type GenerationRow = {
  id: string;
  type: "cv" | "cover-letter" | string;
  job_offer_snippet: string | null;
  created_at: string;
  company_name: string | null;
  pdf_url: string | null;
};

interface Props {
  generations: GenerationRow[];
}

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function GenerationList({ generations }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewCompany, setPreviewCompany] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const handlePreview = (url: string | null, company: string) => {
    setPreviewUrl(url);
    setPreviewCompany(company);
    setPreviewOpen(true);
  };

  const handleClose = () => {
    setPreviewOpen(false);
  };

  return (
    <>
      <ul className="flex flex-col gap-2">
        {generations.map((gen) => {
          const isCv = gen.type === "cv";
          const snippetRaw = gen.job_offer_snippet ?? "";
          const snippet =
            snippetRaw.length > 80 ? `${snippetRaw.slice(0, 80)}...` : snippetRaw || "—";
          const company = gen.company_name?.trim() || "Unknown Company";

          return (
            <li
              key={gen.id}
              className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-white/15 transition-colors"
            >
              {/* Badge */}
              <span
                className={
                  isCv
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0"
                    : "bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0"
                }
              >
                {isCv ? "CV" : "Cover Letter"}
              </span>

              {/* Center: company + snippet */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{company}</p>
                <p className="text-xs text-white/40 truncate">{snippet}</p>
              </div>

              {/* Right: time + preview button */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-white/35 hidden sm:block">
                  {timeAgo(gen.created_at)}
                </span>
                {gen.pdf_url && (
                  <button
                    type="button"
                    onClick={() => handlePreview(gen.pdf_url, company)}
                    className="btn-glass border border-white/10 bg-white/5 text-white/60 hover:text-white text-xs px-2.5 py-1 rounded-lg"
                  >
                    Preview
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <GenerationPreviewModal
        pdfUrl={previewUrl}
        companyName={previewCompany}
        isOpen={previewOpen}
        onClose={handleClose}
      />
    </>
  );
}
