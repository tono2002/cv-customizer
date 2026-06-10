import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GenerateRequestSchema } from "@/lib/types";
import type { StreamEvent } from "@/lib/types";
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

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: StreamEvent) =>
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));

      try {
        send({ type: "progress", step: 1, message: "Analysing your CV and job offer…" });

        send({ type: "progress", step: 2, message: "Tailoring content to the job offer…" });
        const html = await generateTailoredCV(parsed.data);

        send({ type: "progress", step: 3, message: "Rendering PDF…" });
        const pdfBuffer = await renderHtmlToPdf(html);

        send({ type: "done", pdf: Buffer.from(pdfBuffer).toString("base64") });
      } catch (err) {
        console.error("[generate] Error:", err);

        let errorMessage = "An unexpected error occurred";
        if (err instanceof Anthropic.RateLimitError) {
          errorMessage = "Rate limit reached. Please wait a moment and try again.";
        } else if (err instanceof Anthropic.AuthenticationError) {
          errorMessage = "Invalid API key. Check your ANTHROPIC_API_KEY.";
        } else if (err instanceof Anthropic.APIError) {
          errorMessage = `Anthropic API error: ${err.message}`;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        send({ type: "error", error: errorMessage });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
    },
  });
}
