"use client";

import type { Mode } from "@/lib/types";

interface Props {
  mode: Mode;
  onChange: (mode: Mode) => void;
  disabled?: boolean;
}

const OPTIONS: { value: Mode; label: string; icon: React.ReactNode }[] = [
  {
    value: "cv",
    label: "Tailor CV",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    value: "cover-letter",
    label: "Cover Letter",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export function ModeToggle({ mode, onChange, disabled }: Props) {
  return (
    <div
      role="group"
      aria-label="Generation mode"
      className="flex rounded-xl border border-gray-200 bg-gray-100 p-1 gap-1"
    >
      {OPTIONS.map((opt) => {
        const isActive = mode === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={[
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1",
              isActive
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            ].join(" ")}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
