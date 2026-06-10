"use client";

const STEPS = [
  "Analysing your CV and job offer…",
  "Tailoring content to the job offer…",
  "Rendering PDF…",
];

interface Props {
  /** The step number currently active (1-based). Steps below this are done; steps above are pending. */
  currentStep: number;
}

export function ProgressSteps({ currentStep }: Props) {
  return (
    <div role="status" aria-live="polite" aria-label="Generation progress" className="flex flex-col gap-3 py-2">
      {STEPS.map((message, index) => {
        const step = index + 1;
        const isDone = step < currentStep;
        const isActive = step === currentStep;
        const isPending = step > currentStep;

        return (
          <div key={step} className="flex items-center gap-3">
            {/* Step indicator */}
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
              {isDone && (
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {isActive && (
                <span
                  className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"
                  aria-hidden="true"
                />
              )}
              {isPending && (
                <span
                  className="w-3 h-3 rounded-full border-2 border-gray-300"
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Step message */}
            <span
              className={[
                "text-sm transition-colors duration-300",
                isDone ? "text-gray-400 line-through" : "",
                isActive ? "text-gray-900 font-medium" : "",
                isPending ? "text-gray-400" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {message}
            </span>
          </div>
        );
      })}
    </div>
  );
}
