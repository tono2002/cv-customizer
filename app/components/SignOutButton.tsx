"use client";

import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="text-xs border border-white/10 text-white/50 hover:text-white hover:bg-white/5 rounded-lg px-2.5 py-1.5 transition-colors"
    >
      Sign out
    </button>
  );
}
