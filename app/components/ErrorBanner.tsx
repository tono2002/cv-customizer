"use client";

interface Props {
  message: string;
  details?: string;
}

export function ErrorBanner({ message, details }: Props) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 flex items-start gap-3"
    >
      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <p className="text-sm font-medium text-red-800">{message}</p>
        {details && <p className="mt-0.5 text-xs text-red-700">{details}</p>}
      </div>
    </div>
  );
}
