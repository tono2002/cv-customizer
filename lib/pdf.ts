import puppeteer from "puppeteer";

export async function renderHtmlToPdf(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "load" });

    // Give fonts a moment to render after load
    await new Promise((r) => setTimeout(r, 500));

    // Detect page format from @page CSS; fall back to A4
    const format = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules);
          for (const rule of rules) {
            if (rule instanceof CSSPageRule) {
              const size = rule.style.getPropertyValue("size");
              if (size && size.toLowerCase().includes("letter")) return "Letter";
            }
          }
        } catch {
          // cross-origin sheets throw; skip
        }
      }
      return "A4";
    });

    const pdfBuffer = await page.pdf({
      format: format as "A4" | "Letter",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
