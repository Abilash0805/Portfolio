import { launch } from "./lib-browser.mjs";
const URL = "http://127.0.0.1:3777";
const browser = await launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
for (const reduced of [false, true]) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const js = [];
  page.on("response", (r) => {
    if (r.url().endsWith(".js")) js.push(r.url().split("/").pop());
  });
  await page.goto(URL, { waitUntil: "load" });
  await page.waitForTimeout(7000);
  const total = await page.evaluate(() =>
    performance.getEntriesByType("resource")
      .filter((r) => r.name.endsWith(".js"))
      .reduce((a, r) => a + (r.encodedBodySize || 0), 0));
  console.log(reduced ? "reduced-motion:" : "default:      ",
    js.length, "js files,", (total / 1024).toFixed(0), "kB encoded");
  await page.close();
}
await browser.close();
