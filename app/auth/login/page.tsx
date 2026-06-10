"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = "/app";
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + "/auth/callback" },
      });
      if (error) {
        setError(error.message);
        setGoogleLoading(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to sign in with Google.";
      setError(message);
      setGoogleLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
      style={{ backgroundColor: "#05050F" }}
    >
      {/* Aurora blobs */}
      <div className="absolute inset-0 -z-10">
        <div
          className="aurora-blob aurora-blob-1"
          style={{ width: "650px", height: "650px", top: "-180px", left: "-160px" }}
        />
        <div
          className="aurora-blob aurora-blob-2"
          style={{ width: "720px", height: "720px", top: "10%", right: "-220px" }}
        />
        <div
          className="aurora-blob aurora-blob-3"
          style={{ width: "560px", height: "560px", bottom: "-200px", left: "30%" }}
        />
        <div className="landing-grain" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl mb-4"
            style={{
              background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
              boxShadow: "0 10px 40px -10px rgba(139, 92, 246, 0.6)",
            }}
          >
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold gradient-text">CV Customizer</h1>
          <p className="mt-1 text-sm text-white/55">Sign in to your account</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-white/70">Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-white/70">Password</label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p
                className="text-xs rounded-lg px-3 py-2"
                style={{
                  backgroundColor: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#FCA5A5",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/40">or continue with</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Google sign-in */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="glass-card w-full rounded-xl px-4 py-2.5 text-sm font-medium text-white flex items-center justify-center gap-2.5 hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </button>

          <p className="mt-5 text-center text-xs text-white/55">
            No account?{" "}
            <Link href="/auth/signup" className="text-indigo-400 font-medium hover:text-indigo-300 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFFFFF" d="M44.5 20H24v8.5h11.7C34.3 33 29.7 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l6.1-6.1C34 5.4 29.3 3.5 24 3.5 12.7 3.5 3.5 12.7 3.5 24S12.7 44.5 24 44.5c11.5 0 19.5-8.1 19.5-19.5 0-1.7-.2-3.4-.5-5z"/>
    </svg>
  );
}
