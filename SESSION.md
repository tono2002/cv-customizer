# CV Customizer — Session Handoff Document

## What this app is

A Next.js 14 (App Router) SaaS that takes a user's CV PDF + optional LinkedIn export PDF, receives a pasted job offer, and returns a tailored CV or cover letter as a downloadable PDF. Built with TypeScript (strict), Tailwind CSS, Supabase (auth + storage + DB), and the Anthropic Claude API.

**Live at:** http://localhost:3000 (local only for now)
**Repo:** https://github.com/tono2002/cv-customizer

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + custom CSS utilities in `globals.css` |
| Auth + DB + Storage | Supabase |
| AI | Anthropic API — `claude-sonnet-4-6`, max_tokens 6000 |
| PDF rendering | Puppeteer (Chromium, local) |
| 3D / Animation | React Three Fiber (v8) + Framer Motion |
| Payments | Not yet wired (Stripe planned) |

---

## Project structure

```
app/
  page.tsx                          Landing page (public, /)
  layout.tsx                        Root layout (Inter font, dark bg)
  globals.css                       Global styles + utility classes
  app/
    layout.tsx                      App shell (aurora bg + AppNav, /app/*)
    page.tsx                        Dashboard (/app — requires auth)
    generate/
      page.tsx                      Generation page (/app/generate — requires auth)
  auth/
    login/page.tsx                  Sign in page (dark theme + Google OAuth)
    signup/page.tsx                 Sign up page (confirm password + Google OAuth)
    callback/route.ts               OAuth/email callback → redirects to /app
  api/
    generate/route.ts               POST — streams NDJSON (progress + PDF base64)
    profile/route.ts                GET/POST — load/save CV & LinkedIn to Storage
    generations/route.ts            POST — save generation record to DB
  components/
    landing/                        Landing page sections
      Nav.tsx, Hero.tsx, HeroScene.tsx (Three.js)
      HowItWorks.tsx, Features.tsx, Pricing.tsx
      FinalCTA.tsx, Footer.tsx, CursorGlow.tsx
    app/                            App-area components
      AppNav.tsx                    Fixed top nav with shiny "New Generation" btn
      GenerationList.tsx            Client component — recent generations list
      GenerationPreviewModal.tsx    PDF preview modal (framer-motion)
    CVCustomizer.tsx                Main generation form (mode toggle, drop zones)
    DropZone.tsx                    Drag-and-drop PDF uploader
    ModeToggle.tsx                  CV / Cover Letter segmented control
    GenerateButton.tsx              Animated gradient CTA button
    ProgressSteps.tsx               3-step streaming progress indicator
    CVPreview.tsx                   Post-generation iframe preview
    ErrorBanner.tsx, SignOutButton.tsx, SuccessBanner.tsx
lib/
  types.ts                          Zod schemas + TypeScript types
  anthropic.ts                      Anthropic client, prompts, generateTailoredCV()
  pdf.ts                            Puppeteer HTML→PDF renderer
  supabase/
    client.ts                       Browser Supabase client
    server.ts                       Server Supabase client (uses cookies)
middleware.ts                       Auth: / public, /app/* protected, /auth/* redirects
```

---

## Design system: "Midnight Indigo"

All screens share this palette — do NOT use light colors in the app area:

- **Background:** `#05050F`
- **Glass cards:** `rgba(15,15,26,0.8)` + `1px solid rgba(255,255,255,0.07)` + `backdrop-filter: blur(12px)` → use `.glass-card` CSS class
- **Gradient:** Indigo `#6366F1` → Violet `#8B5CF6` → Cyan `#06B6D4`
- **Text:** white / `text-white/70` / `text-white/55` / `text-white/40`
- **Inputs:** `bg-white/5 border-white/10 text-white placeholder:text-white/35 focus:ring-indigo-500`
- **Primary button:** `.btn-gradient` (indigo→violet, glow shadow)
- **Secondary button:** `.btn-glass` (subtle lift + border brighten on hover)
- **Shiny button:** `.btn-shine` (animated moving gradient, used for "New Generation" CTA)
- **Gradient text:** `.gradient-text`
- **Aurora blobs:** `.aurora-blob .aurora-blob-1/2/3` (animated radial gradients)
- **Cursor glow:** `CursorGlow` component tracks mouse with spring, subtle violet radial gradient follows cursor on landing page

---

## Generation pipeline

1. **Client** reads PDFs as base64, sends POST to `/api/generate` with `{ cvBase64, cvMediaType, linkedinBase64?, linkedinMediaType?, jobOffer, mode: 'cv'|'cover-letter' }`
2. **Route** checks auth + generation limits (Free: 3/month, Pro: 50/month), then streams NDJSON:
   - `{ type: "progress", step: 1, message: "Analysing…" }`
   - `{ type: "progress", step: 2, message: "Tailoring…" }`  
   - `{ type: "progress", step: 3, message: "Rendering PDF…" }`
   - `{ type: "done", pdf: "<base64>" }` or `{ type: "error", error: "…" }`
3. **Anthropic** receives: system prompt (cached) + CV PDF doc block + LinkedIn PDF doc block (cache_control: ephemeral on last doc) + job offer text. Returns HTML.
4. **Puppeteer** renders HTML → PDF Buffer → base64 → streamed to client
5. **Client** auto-downloads PDF, then: uploads PDF to Supabase Storage, extracts company name from job offer, saves generation record to `/api/generations`

**Prompt caching:** system prompt + PDF documents cached — "Generate again" with same PDFs costs ~90% less on input tokens.

---

## Supabase schema

### `profiles` table
```sql
id uuid pk
user_id uuid → auth.users (unique)
cv_url text              -- storage path: {userId}/cv.pdf
cv_filename text
linkedin_url text        -- storage path: {userId}/linkedin.pdf
linkedin_filename text
plan text default 'free' -- 'free' | 'pro' | 'pro+'
generations_used int default 0
generations_reset_at timestamptz default now()
updated_at timestamptz
```

### `generations` table
```sql
id uuid pk
user_id uuid → auth.users
type text                -- 'cv' | 'cover-letter'
job_offer_snippet text   -- first 80 chars
company_name text        -- extracted from job offer
pdf_url text             -- 7-day signed URL from Supabase Storage
created_at timestamptz
```

### Supabase Storage: `cv-files` bucket (private)
- `{userId}/cv.pdf` — saved CV
- `{userId}/linkedin.pdf` — saved LinkedIn export
- `{userId}/generations/{timestamp}.pdf` — generated PDFs (preview)

**RLS:** users can only read/write their own `{userId}/` folder.

---

## Auth flow

- **Landing** `/` → public, no auth required
- **Sign up/in** `/auth/signup` `/auth/login` → email+password OR Google OAuth
- **After auth** → redirected to `/app` (dashboard)
- **Dashboard** `/app` → shows plan, usage stats, recent generations with company name + PDF preview
- **Generate** `/app/generate` → CV customizer form
- **Sign out** → redirected to `/` landing page
- **Middleware** protects all `/app/*` routes, bounces authed users away from `/auth/*`

---

## Generation limits (enforced in `/api/generate`)

| Plan | Limit | Price |
|---|---|---|
| Free | 3/month | €0 |
| Pro | 50/month | €9.99/month |
| Pro+ | 200/month | €24.99/month |

Cost per generation: ~€0.04–0.07 (Sonnet 4.6 + Puppeteer).

---

## What's been built (complete)

- [x] Landing page — hero with 3D Three.js scene + aurora blobs + cursor glow, how it works, features, pricing (3 tiers), CTA, footer
- [x] Auth — email/password sign up (with confirm password) + Google OAuth
- [x] User profiles — CV + LinkedIn saved to Supabase Storage, auto-loaded on login
- [x] CV generation — PDF tailored to job offer, streams progress, auto-downloads
- [x] Cover letter mode — same pipeline, one toggle
- [x] Dashboard — plan stats, usage bar, recent generations with company name + preview modal
- [x] Navigation — AppNav with shiny "New Generation" button, Dashboard link
- [x] Generation history — saved to DB with company name extraction + PDF preview
- [x] Generation limits — enforced server-side per plan
- [x] Dark theme — consistent Midnight Indigo across all screens
- [x] Hover effects — btn-gradient, btn-glass, btn-shine on all interactive elements

---

## What's NOT done yet (planned)

### High priority
- [ ] **Stripe integration** — payment processing for Pro/Pro+ upgrades, webhook to update `profiles.plan`
- [ ] **Monthly reset** — cron job or Supabase Edge Function to reset `generations_used` to 0 on the 1st of each month
- [ ] **Upgrade prompt** — when user hits the limit, show an upgrade modal instead of a generic error

### Medium priority
- [ ] **DOCX export** — Pro-only feature, convert generated HTML to .docx using `html-to-docx` or similar
- [ ] **CV score** — keyword match % shown before/after generation (client-side, no extra API call)
- [ ] **Generation history storage cleanup** — signed URLs expire after 7 days; need a strategy (refresh on access, or store permanently in Storage)
- [ ] **Job offer URL scraping** — paste a LinkedIn/Indeed URL instead of the full text
- [ ] **History persistence in localStorage** — fallback for non-authenticated preview

### Nice to have
- [ ] **Dark mode toggle** — currently always dark
- [ ] **Mobile UX pass** — drop zones and textarea on narrow viewports
- [ ] **Progress indicator detail** — show estimated time remaining during generation
- [ ] **Email notifications** — notify user when generation is ready (for slow generations)
- [ ] **Teams plan** — multi-seat, shared CV templates

---

## Environment variables

```
ANTHROPIC_API_KEY=sk-ant-...          # Anthropic console
NEXT_PUBLIC_SUPABASE_URL=https://...  # Supabase project settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... # Supabase project settings → API
```

Stored in `.env.local` (gitignored). Template in `env.example`.

---

## Running locally

```bash
npm install        # also downloads Chromium for Puppeteer (~200MB, one-time)
cp env.example .env.local
# fill in .env.local with your keys
npm run dev        # http://localhost:3000
```

---

## Key files to read first in a new session

1. `lib/anthropic.ts` — system prompts + Anthropic call
2. `app/api/generate/route.ts` — streaming pipeline
3. `app/app/page.tsx` — dashboard
4. `app/components/CVCustomizer.tsx` — main UI logic
5. `middleware.ts` — auth routing
6. `app/globals.css` — all CSS utilities
