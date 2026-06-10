import { CVCustomizer } from "./components/CVCustomizer";

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">CV Customizer</h1>
          <p className="mt-2 text-base text-gray-500">
            Upload your CV, add your LinkedIn export, paste a job offer — get a tailored PDF back in seconds.
          </p>
        </header>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <CVCustomizer />
        </div>

        <footer className="mt-8 text-center text-xs text-gray-400">
          Your files are sent directly to the Anthropic API and are never stored.
        </footer>
      </div>
    </main>
  );
}
