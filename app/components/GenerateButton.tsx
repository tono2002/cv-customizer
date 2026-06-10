"use client";

interface Props {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}

export function GenerateButton({ disabled, loading, onClick }: Props) {
  const isInactive = disabled && !loading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      className={[
        "w-full rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05050F]",
        isInactive
          ? "bg-white/10 text-white/30 cursor-not-allowed"
          : "btn-gradient text-white active:scale-[0.98]",
      ].join(" ")}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Spinner />
          Generating…
        </span>
      ) : (
        "Generate tailored CV"
      )}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
