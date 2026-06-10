import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GenerationList, type GenerationRow } from "@/app/components/app/GenerationList";

type ProfileRow = {
  plan: "free" | "pro" | string | null;
  generations_used: number | null;
  generations_reset_at: string | null;
};

function firstNameFromEmail(email: string | null | undefined): string {
  if (!email) return "there";
  const local = email.split("@")[0] ?? email;
  const cleaned = local.replace(/[._-]+/g, " ").trim();
  if (!cleaned) return email;
  const first = cleaned.split(" ")[0] ?? cleaned;
  return first.charAt(0).toUpperCase() + first.slice(1);
}

function SparkleIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

const FREE_LIMIT = 3;

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const email = user?.email ?? null;
  const greetingName = firstNameFromEmail(email);

  // Profile (may not exist yet)
  let profile: ProfileRow | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("plan, generations_used, generations_reset_at")
      .eq("user_id", user.id)
      .maybeSingle();
    profile = (data as ProfileRow | null) ?? null;
  }

  const plan = (profile?.plan ?? "free").toLowerCase();
  const isPro = plan === "pro";
  const used = profile?.generations_used ?? 0;
  const remaining = isPro ? Infinity : Math.max(0, FREE_LIMIT - used);
  const usagePct = isPro ? 0 : Math.min(100, Math.round((used / FREE_LIMIT) * 100));

  // Recent generations
  let recent: GenerationRow[] = [];
  let totalGenerations = 0;
  if (user) {
    const { data } = await supabase
      .from("generations")
      .select("id, type, job_offer_snippet, created_at, company_name, pdf_url")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);
    recent = (data as GenerationRow[] | null) ?? [];

    const { count } = await supabase
      .from("generations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    totalGenerations = count ?? 0;
  }

  void remaining;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Welcome section */}
      <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome back, <span className="gradient-text">{greetingName}</span>
          </h1>
          <p className="mt-1.5 text-sm text-white/55">Here&apos;s your generation activity</p>
        </div>
        <Link
          href="/app/generate"
          className="btn-shine inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white self-start"
        >
          <SparkleIcon /> New Generation
        </Link>
      </section>

      {/* Stats row */}
      <section className="grid gap-4 sm:grid-cols-3 mb-10">
        {/* Plan card */}
        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-white/40">Current plan</p>
          <p className="mt-2 text-2xl font-bold">
            {isPro ? (
              <span
                style={{
                  background: "linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                Pro
              </span>
            ) : (
              <span className="gradient-text">Free</span>
            )}
          </p>
          {!isPro && (
            <Link
              href="/#pricing"
              className="mt-3 inline-block text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Upgrade to Pro -&gt;
            </Link>
          )}
        </div>

        {/* Generations used card */}
        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-white/40">This month</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {isPro ? "Unlimited" : `${used} / ${FREE_LIMIT}`}
          </p>
          <div className="mt-3 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full h-1.5"
              style={{ width: isPro ? "100%" : `${usagePct}%` }}
            />
          </div>
        </div>

        {/* Total generations card */}
        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-white/40">All time</p>
          <p className="mt-2 text-2xl font-bold text-white">{totalGenerations}</p>
          <p className="mt-3 text-xs text-white/40">
            Total generation{totalGenerations === 1 ? "" : "s"}
          </p>
        </div>
      </section>

      {/* Recent generations */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">Recent generations</h2>

        {recent.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center">
            <div
              className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl mb-4"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.2) 100%)",
                border: "1px solid rgba(139,92,246,0.25)",
              }}
            >
              <svg className="h-5 w-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-white/55 mb-5">No generations yet. Start your first one!</p>
            <Link
              href="/app/generate"
              className="btn-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            >
              Start a generation
            </Link>
          </div>
        ) : (
          <GenerationList generations={recent} />
        )}
      </section>

      {/* Quick action */}
      <section className="flex justify-center">
        <Link
          href="/app/generate"
          className="btn-gradient inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
        >
          Start new generation -&gt;
        </Link>
      </section>
    </div>
  );
}
