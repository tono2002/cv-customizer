"use client";

interface Props {
  onGenerateAgain: () => void;
}

export function SuccessBanner({ onGenerateAgain }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 flex items-start gap-3"
    >
      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div className="flex-1">
        <p className="text-sm font-medium text-green-800">Your tailored CV has been downloaded.</p>
        <p className="mt-0.5 text-xs text-green-700">
          Want a different spin? Hit &ldquo;Generate again&rdquo; — your uploaded PDFs stay loaded.
        </p>
      </div>
      <button
        type="button"
        onClick={onGenerateAgain}
        className="ml-auto flex-shrink-0 rounded-lg border border-green-300 bg-white px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1"
      >
        Generate again
      </button>
    </div>
  );
}
