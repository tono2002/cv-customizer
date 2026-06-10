# CV Customizer

Upload your CV and LinkedIn export (both PDF), paste a job offer, and receive a tailored CV as a downloadable PDF. The app uses the Anthropic API to rewrite only the wording/keywords — it never invents experience, dates, or qualifications.

## Setup

1. **Install dependencies** (this also downloads Chromium for Puppeteer — ~200 MB, one-time):
   ```bash
   npm install
   ```

2. **Set your API key:**
   ```bash
   cp env.example .env.local
   # then edit .env.local and fill in your ANTHROPIC_API_KEY
   ```

3. **Run the dev server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Usage

1. Drop your current CV PDF into the first zone.
2. Optionally drop your LinkedIn profile export PDF (shorter/recent exports work best — full exports can be 10–30 pages and cost more to process).
3. Paste the full job description text.
4. Click **Generate tailored CV** — the result downloads automatically.
5. Use **Generate again** to regenerate with the same PDFs (the API prompt cache kicks in, cutting input costs ~90%).

## Notes

- **Puppeteer / Chromium**: `npm install` triggers Puppeteer's postinstall hook, which downloads a local Chromium binary (~200 MB). This is required for PDF rendering and only happens once.
- **Model**: defaults to `claude-opus-4-8` with adaptive thinking. To iterate cheaply, change `MODEL_ID` in `lib/anthropic.ts` to `claude-sonnet-4-6`.
- **File size**: PDFs over ~4 MB will show a warning. The Anthropic API accepts up to 32 MB per document but very large files are slow and costly.
- **Local only**: this app is not optimised for serverless deployment (Puppeteer requires a persistent Chromium binary).

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key from console.anthropic.com |
