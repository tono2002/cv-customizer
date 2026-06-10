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
2. Before writing any HTML, mentally map every piece of content to its section: which bullets belong under which job entry, which bullets belong under which education entry, which items belong in Skills, Projects, etc. Never move a bullet from one section to another.
3. Read the LinkedIn PDF (if provided) to surface any additional factual details — dates, titles, metrics, skills — that are absent from the CV but verifiable.
4. Read the job offer and identify the key terminology, skills, and competencies the employer values.
5. Rewrite the CV content so that wording, keyword emphasis, and phrasing mirror the job offer wherever truthful. Only use information present in the CV or LinkedIn — never invent, approximate, or infer experience, employers, dates, metrics, or qualifications. If a detail is absent from both sources, omit it entirely.

SECTION STRUCTURE RULES (critical — violations cause broken CVs):
- Every section heading (Education, Experience, Skills, Projects, etc.) must appear exactly once, in the same order as the original.
- Every bullet point or sub-item must be a direct HTML child of its parent section container — never let bullets from one section appear inside a different section's DOM node.
- Experience entries: each job must have its own container (div/section). The company name, title, dates, location, and ALL bullets for that job must be nested inside that container and nowhere else.
- Education entries: same rule — each school's bullets (coursework, exchange programme, etc.) must be nested inside that school's container, not under any other section.
- Skills, Languages, Projects, and Other sections must each be completely self-contained. No content from these sections may bleed into each other.
- After writing the HTML, mentally re-read each section top to bottom and verify every item is in the correct parent container before outputting.

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
- DATES: copy every date exactly as it appears in the original CV — including start month, start year, end month, end year, and any ranges (e.g. "OCTOBER 2024 - AUGUST 2025", "SEPTEMBER 2020 - JUNE 2024"). Never shorten, truncate, approximate, or reformat a date. If the original shows a range, the output must show the same range.
- SECTION NAMES: copy every section heading character-for-character from the original (e.g. "PROFESSIONAL EXPERIENCE", "EDUCATION", "MAJOR PROJECTS"). Never rename, reword, merge, or reorder sections.
- Only the prose content inside each section changes — dates, headings, section order, and structural layout are frozen.`;

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
