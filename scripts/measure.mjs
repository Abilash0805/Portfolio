import { launch } from "./lib-browser.mjs";

const URL = process.env.M_URL ?? "http://127.0.0.1:3777";
const reduced = process.env.M_REDUCED === "1";

const browser = await launch({
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: reduced ? "reduce" : "no-preference",
});

let bytes = 0;
const byType = {};
page.on("response", async (r) => {
  try {
    const len = Number((await r.allHeaders())["content-length"] ?? 0);
    if (!len) return;
    bytes += len;
    const t = r.url().endsWith(".js") ? "js" : r.url().match(/\.(png|jpg|webp|avif)/) || r.url().includes("_next/image") ? "img" : r.url().match(/\.(woff2?|ttf)/) ? "font" : "other";
    byType[t] = (byType[t] ?? 0) + len;
  } catch {}
});

await page.goto(URL, { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(6000);

const vitals = await page.evaluate(
  () =>
    new Promise((resolve) => {
      const out = { lcp: 0, cls: 0, fcp: 0 };
      const fcp = performance.getEntriesByName("first-contentful-paint")[0];
      if (fcp) out.fcp = fcp.startTime;
      try {
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) out.lcp = e.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((l) => {
          for (const e of l.getEntries())
            if (!e.hadRecentInput) out.cls += e.value;
        }).observe({ type: "layout-shift", buffered: true });
      } catch {}
      setTimeout(() => resolve(out), 1500);
    }),
);

const threeLoaded = await page.evaluate(() =>
  performance.getEntriesByType("resource").some((r) => r.transferSize > 400000),
);

console.log(reduced ? "--- prefers-reduced-motion ---" : "--- default ---");
console.log("FCP", Math.round(vitals.fcp), "ms   LCP", Math.round(vitals.lcp), "ms   CLS", vitals.cls.toFixed(4));
console.log("transfer", (bytes / 1024).toFixed(0), "kB", JSON.stringify(Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, `${(v / 1024).toFixed(0)}kB`]))));
console.log("heavy chunk fetched:", threeLoaded);
await browser.close();
