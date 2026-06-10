import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("cv_url, cv_filename, linkedin_url, linkedin_filename, updated_at")
    .eq("user_id", user.id)
    .single();

  if (!profile) return NextResponse.json({ profile: null });

  // Create signed URLs valid for 1 hour
  const urls: { cvSignedUrl?: string; linkedinSignedUrl?: string } = {};

  if (profile.cv_url) {
    const { data } = await supabase.storage
      .from("cv-files")
      .createSignedUrl(`${user.id}/cv.pdf`, 3600);
    if (data) urls.cvSignedUrl = data.signedUrl;
  }

  if (profile.linkedin_url) {
    const { data } = await supabase.storage
      .from("cv-files")
      .createSignedUrl(`${user.id}/linkedin.pdf`, 3600);
    if (data) urls.linkedinSignedUrl = data.signedUrl;
  }

  return NextResponse.json({
    profile: {
      cvFilename: profile.cv_filename,
      linkedinFilename: profile.linkedin_filename,
      updatedAt: profile.updated_at,
      ...urls,
    },
  });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { fileType, base64, filename } = await req.json() as {
    fileType: "cv" | "linkedin";
    base64: string;
    filename: string;
  };

  if (!["cv", "linkedin"].includes(fileType) || !base64 || !filename) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const storagePath = `${user.id}/${fileType}.pdf`;
  const bytes = Buffer.from(base64, "base64");

  const { error: uploadError } = await supabase.storage
    .from("cv-files")
    .upload(storagePath, bytes, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    console.error("[profile] Upload error:", uploadError);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const updateField = fileType === "cv"
    ? { cv_url: storagePath, cv_filename: filename }
    : { linkedin_url: storagePath, linkedin_filename: filename };

  await supabase.from("profiles").upsert({
    user_id: user.id,
    ...updateField,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });

  return NextResponse.json({ ok: true });
}
