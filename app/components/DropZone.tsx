"use client";

import { useCallback, useRef, useState } from "react";
import type { UploadedFile } from "@/lib/types";

const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB

interface Props {
  id: string;
  label: string;
  hint?: string;
  file: UploadedFile | null;
  onFile: (file: UploadedFile | null) => void;
  disabled?: boolean;
  savedToProfile?: boolean;
}

export function DropZone({ id, label, hint, file, onFile, disabled, savedToProfile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  const processFile = useCallback(
    (raw: File) => {
      setWarning(null);
      if (raw.type !== "application/pdf") {
        setWarning("Only PDF files are accepted.");
        return;
      }
      if (raw.size > MAX_SIZE_BYTES) {
        setWarning(`File is ${(raw.size / 1024 / 1024).toFixed(1)} MB — large files cost more to process and may be slow.`);
      }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1];
        onFile({ name: raw.name, base64, mediaType: "application/pdf", sizeBytes: raw.size });
      };
      reader.readAsDataURL(raw);
    },
    [onFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      const dropped = e.dataTransfer.files[0];
      if (dropped) processFile(dropped);
    },
    [disabled, processFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const picked = e.target.files?.[0];
      if (picked) processFile(picked);
      e.target.value = "";
    },
    [processFile]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        inputRef.current?.click();
      }
    },
    []
  );

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-white/70">{label}</label>
        {savedToProfile && (
          <span className="text-xs text-cyan-400 font-medium">Saved to profile</span>
        )}
      </div>

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`Upload ${label}`}
        aria-disabled={disabled}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        className={[
          "relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-all duration-150 cursor-pointer",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05050F]",
          disabled
            ? "cursor-not-allowed opacity-50 border-white/10 bg-white/[0.03]"
            : dragOver
            ? "border-indigo-500/60 bg-indigo-500/10 scale-[1.01]"
            : file
            ? "border-emerald-500/60 bg-emerald-500/10"
            : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={handleChange}
          disabled={disabled}
          aria-label={label}
        />

        {file ? (
          <>
            <CheckIcon />
            <div>
              <p className="text-sm font-medium text-emerald-400 truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-emerald-400/70">{(file.sizeBytes / 1024).toFixed(0)} KB</p>
            </div>
            {!disabled && (
              <button
                type="button"
                aria-label="Remove file"
                onClick={(e) => { e.stopPropagation(); onFile(null); setWarning(null); }}
                className="absolute top-2 right-2 rounded-full p-1 text-white/30 hover:text-white/60 hover:bg-white/10 transition-colors"
              >
                <XIcon />
              </button>
            )}
          </>
        ) : (
          <>
            <UploadIcon />
            <div>
              <p className="text-sm text-white/50">
                Drop PDF here or <span className="text-indigo-400 font-medium">browse</span>
              </p>
            </div>
          </>
        )}
      </div>

      {hint && <p className="text-xs text-white/40">{hint}</p>}
      {warning && <p className="text-xs text-amber-400" role="alert">{warning}</p>}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
