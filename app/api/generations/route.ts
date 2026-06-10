import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type PostBody = {
  type?: "cv" | "cover-letter";
  jobOfferSnippet?: string;
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: PostBody;
  try {
    body = (await req.json()) as PostBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const type = body.type;
  const snippet = (body.jobOfferSnippet ?? "").slice(0, 80);

  if (type !== "cv" && type !== "cover-letter") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  // Insert generation
  const { error: insertError } = await supabase.from("generations").insert({
    user_id: user.id,
    type,
    job_offer_snippet: snippet,
  });

  if (insertError) {
    console.error("[generations] Insert error:", insertError);
    return NextResponse.json({ error: "Failed to record generation" }, { status: 500 });
  }

  // Increment generations_used on profile (upsert if missing)
  const { data: existing } = await supabase
    .from("profiles")
    .select("generations_used")
    .eq("user_id", user.id)
    .maybeSingle();

  const currentUsed = (existing?.generations_used as number | null) ?? 0;
  const nextUsed = currentUsed + 1;

  const { error: upsertError } = await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      generations_used: nextUsed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (upsertError) {
    console.error("[generations] Profile upsert error:", upsertError);
    // Generation row was already inserted — don't fail the request
  }

  return NextResponse.json({ ok: true });
}
