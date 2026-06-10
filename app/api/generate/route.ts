import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GenerateRequestSchema } from "@/lib/types";
import { generateTailoredCV } from "@/lib/anthropic";
import { renderHtmlToPdf } from "@/lib/pdf";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = GenerateRequestSchema.safeParse(body);
  if (!parsed.success) {
    const details = parsed.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
    return NextResponse.json({ ok: false, error: "Validation failed", details }, { status: 400 });
  }

  try {
    const html = await generateTailoredCV(parsed.data);
    const pdfBuffer = await renderHtmlToPdf(html);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="tailored-cv.pdf"',
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("[generate] Error:", err);

    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { ok: false, error: "Rate limit reached. Please wait a moment and try again." },
        { status: 429 }
      );
    }
    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { ok: false, error: "Invalid API key. Check your ANTHROPIC_API_KEY." },
        { status: 401 }
      );
    }
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { ok: false, error: `Anthropic API error: ${err.message}` },
        { status: 502 }
      );
    }

    const message = err instanceof Error ? err.message : "An unexpected error occurred";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
