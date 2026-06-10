import { CVCustomizer } from "../../components/CVCustomizer";

export default function GeneratePage() {
  return (
    <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight gradient-text">New Generation</h1>
        <p className="mt-1.5 text-sm text-white/55">
          Upload your CV, add your LinkedIn export, paste a job offer and get a tailored PDF back in seconds.
        </p>
      </header>

      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <CVCustomizer />
      </div>

      <footer className="mt-8 text-center text-xs text-white/40">
        Your files are sent directly to the Anthropic API and are never stored beyond your profile.
      </footer>
    </div>
  );
}
