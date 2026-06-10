# CV Customizer — Project TODO

## Done

- [x] **Project scaffold** — Next.js 14 App Router, TypeScript (strict), Tailwind CSS
- [x] **Dependencies** — `@anthropic-ai/sdk`, `puppeteer`, `zod` installed
- [x] **Type contract** (`lib/types.ts`) — `GenerateRequest` Zod schema, shared response types, `UploadedFile` type
- [x] **Anthropic integration** (`lib/anthropic.ts`) — `generateTailoredCV()` with:
  - `claude-opus-4-8`, `max_tokens: 16000`, `thinking: { type: "adaptive" }`
  - PDF document blocks + `cache_control: ephemeral` on last document so "Generate again" hits the prompt cache
  - System prompt instructing the model to replicate layout/design and only rewrite content
  - Lazy API key validation (throws at call time, not module load)
  - Defensive markdown fence stripping on the response
- [x] **PDF rendering** (`lib/pdf.ts`) — Puppeteer `setContent` → `page.pdf`, auto-detects A4 vs Letter from `@page` CSS
- [x] **API route** (`app/api/generate/route.ts`) — POST endpoint with:
  - Zod validation → structured 400 errors
  - Typed Anthropic error handling (`RateLimitError`, `AuthenticationError`, `APIError`)
  - Streams PDF back as `application/pdf` with `Content-Disposition: attachment`
- [x] **UI components** — `DropZone`, `GenerateButton`, `SuccessBanner`, `ErrorBanner`, `CVCustomizer`
  - Drag-and-drop + click-to-upload, keyboard accessible, ARIA labelled
  - 4 MB file size warning
  - LinkedIn field optional; "Generate again" re-uses already-uploaded PDFs
  - Loading/disabled/error/success states
- [x] **Styling** — minimalist Apple-inspired UI, Inter font, Tailwind, responsive
- [x] **Config** — `next.config.mjs` with `serverComponentsExternalPackages` for Puppeteer
- [x] **Deliverables** — `env.example`, updated `README.md`, `.gitignore`

---

## To Do

### Core quality
- [ ] **End-to-end test** — run a real generation with a sample CV + job offer; verify the output PDF matches original layout and page count
- [ ] **Timeout handling** — generation can take 60–120 s with `claude-opus-4-8` + thinking; add a server-side `AbortSignal` timeout and surface a friendly message if it fires
- [ ] **Request size guard** — reject payloads over a hard limit (e.g. 40 MB) at the route level before hitting the Anthropic API
- [ ] **Font wait in Puppeteer** — replace the crude `setTimeout(500)` in `lib/pdf.ts` with `document.fonts.ready` for reliable font rendering

### UX improvements
- [ ] **Progress indicator** — generation takes ~30–90 s; a step-by-step status message ("Analysing CV…", "Rewriting content…", "Rendering PDF…") would reduce perceived wait time
- [ ] **Preview pane** — render the returned HTML in an `<iframe>` or `<object>` before/alongside the download so the user can review before saving
- [ ] **Job offer character count** — show a live count; very short offers produce weaker tailoring
- [ ] **Mobile layout** — drop zones stack well but the textarea could use a taller default on narrow viewports

### Reliability / ops
- [ ] **`.env.local` presence check on startup** — log a clear warning (not a crash) if the key is missing, so `npm run dev` without setup gives a useful message
- [ ] **Error retry UI** — after an error the "Generate tailored CV" button should re-enable; currently requires a page reload if state gets stuck
- [ ] **Rate-limit back-off hint** — when a 429 is returned, show the retry-after value from the Anthropic response header if present

### Stretch / future
- [ ] **Multiple output formats** — option to download the raw HTML alongside the PDF for further editing
- [ ] **Cover letter mode** — same pipeline but produce a one-page cover letter instead of a CV rewrite
- [ ] **History** — store past generations in `localStorage` (HTML snapshots) so the user can revisit without regenerating
- [ ] **Dark mode** — Tailwind `dark:` variants; currently only light theme is styled
