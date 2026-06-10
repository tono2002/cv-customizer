import { createClient } from "@/lib/supabase/server";
import { CVCustomizer } from "../components/CVCustomizer";
import { SignOutButton } from "../components/SignOutButton";

export default async function AppHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main
      className="relative min-h-screen px-4 py-12 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundColor: "#05050F" }}
    >
      {/* Subtle aurora background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="aurora-blob aurora-blob-1"
          style={{ width: "450px", height: "450px", top: "-160px", left: "-120px", opacity: 0.35 }}
        />
        <div
          className="aurora-blob aurora-blob-2"
          style={{ width: "520px", height: "520px", top: "20%", right: "-180px", opacity: 0.3 }}
        />
        <div
          className="aurora-blob aurora-blob-3"
          style={{ width: "400px", height: "400px", bottom: "-180px", left: "30%", opacity: 0.25 }}
        />
        <div className="landing-grain" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl">
        <header className="mb-10 text-center relative">
          {user && (
            <div className="absolute right-0 top-0 flex items-center gap-2">
              <span className="text-xs text-white/55 hidden sm:block">{user.email}</span>
              <SignOutButton />
            </div>
          )}
          <div
            className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
              boxShadow: "0 10px 40px -10px rgba(139, 92, 246, 0.6)",
            }}
          >
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">CV Customizer</h1>
          <p className="mt-2 text-base text-white/55">
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
    </main>
  );
}
