import { createClient } from "@/lib/supabase/server";
import { AppNav } from "../components/app/AppNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div
      className="relative min-h-screen overflow-hidden"
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

      <AppNav userEmail={user?.email ?? null} />

      <main className="relative z-10 pt-20">{children}</main>
    </div>
  );
}
