import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import type { GenerateRequest } from "./types";

function getClient(): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  return new Anthropic({ apiKey: key });
}

export const MODEL_ID = "claude-opus-4-8";
const MAX_TOKENS = 16000;

const SYSTEM_PROMPT = `You are an expert CV writer and front-end designer. Your task is to produce a tailored CV as a single, complete, self-contained HTML document.

PROCESS:
1. Carefully examine the provided CV PDF to infer the exact visual design: layout (single/double column, sidebar), section order, fonts, colors, spacing, approximate word count per section, and bullet count per role.
2. Read the LinkedIn PDF (if provided) to surface any additional factual details — dates, titles, metrics, skills — that are absent from the CV but verifiable.
3. Read the job offer and identify the key terminology, skills, and competencies the employer values.
4. Rewrite the CV content so that wording, keyword emphasis, and phrasing mirror the job offer wherever truthful. Only use information present in the CV or LinkedIn — never invent, approximate, or infer experience, employers, dates, metrics, or qualifications. If a detail is absent from both sources, omit it entirely.

OUTPUT RULES:
- Return ONLY a raw, complete HTML document. No markdown fences, no commentary, no explanation before or after.
- All CSS must be in a single <style> tag inside <head>. No external stylesheets except Google Fonts via @import.
- Use web-safe fonts or Google Fonts imported via CSS @import (not <link> tags).
- Replicate the original CV's layout, section order, fonts, colors, and spacing as closely as possible.
- Maintain the SAME LENGTH as the original: if the original is one page, output must be one page. Match approximate word count and bullet count per section so nothing overflows.
- Detect the page size from the CV (A4 vs US Letter). Default to A4 if uncertain.
- Set page dimensions in CSS using @page and body styles so the output prints/renders to exactly one page.
- For @page: use size A4 (210mm 297mm) or Letter (8.5in 11in) with zero margins, and set print-color-adjust: exact.
- Structure the body with padding that matches the original CV's margins.
- Only CONTENT and keyword emphasis change — structure and visual design stay the same.`;

interface DocumentBlock {
  type: "document";
  source: { type: "base64"; media_type: "application/pdf"; data: string };
  title?: string;
  cache_control?: { type: "ephemeral" };
}

interface TextBlock {
  type: "text";
  text: string;
}

type ContentBlock = DocumentBlock | TextBlock;

export async function generateTailoredCV(request: GenerateRequest): Promise<string> {
  const content: ContentBlock[] = [
    {
      type: "document",
      source: {
        type: "base64",
        media_type: "application/pdf",
        data: request.cvBase64,
      },
      title: "Current CV",
    },
  ];

  if (request.linkedinBase64) {
    content.push({
      type: "document",
      source: {
        type: "base64",
        media_type: "application/pdf",
        data: request.linkedinBase64,
      },
      title: "LinkedIn Profile Export",
      cache_control: { type: "ephemeral" },
    });
  } else {
    (content[0] as DocumentBlock).cache_control = { type: "ephemeral" };
  }

  content.push({
    type: "text",
    text: `JOB OFFER:\n\n${request.jobOffer}`,
  });

  const messages: MessageParam[] = [
    { role: "user", content: content as MessageParam["content"] },
  ];

  const anthropic = getClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await (anthropic.messages.create as any)({
    model: MODEL_ID,
    max_tokens: MAX_TOKENS,
    thinking: { type: "adaptive" },
    system: SYSTEM_PROMPT,
    messages,
    betas: ["pdfs-2024-09-25"],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const textBlock = (response.content as any[]).find((b: any) => b.type === "text");
  if (!textBlock) {
    throw new Error("Model returned no text content");
  }

  return stripMarkdownFences(textBlock.text as string);
}

function stripMarkdownFences(html: string): string {
  return html
    .replace(/^```(?:html)?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();
}
