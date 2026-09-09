import { launch } from "./lib-browser.mjs";

const URL = process.env.SHOOT_URL ?? "http://127.0.0.1:3111";
const OUT = process.env.SHOOT_OUT ?? "/tmp/claude-0/-home-user-Portfolio/25a52f0a-65a3-52c1-982f-6e55b5eb0d9e/scratchpad/shots";
const width = Number(process.env.SHOOT_W ?? 1440);
const height = Number(process.env.SHOOT_H ?? 900);

const browser = await launch({
  args: [
    "--enable-unsafe-swiftshader",
    "--use-angle=swiftshader",
    "--ignore-gpu-blocklist",
  ],
});
const page = await browser.newPage({ viewport: { width, height } });
page.on("pageerror", (e) => console.log("PAGEERROR:", e.message.split("\n")[0]));
page.on("response", (r) => {
  if (r.status() >= 400) console.log("HTTP", r.status(), r.url().slice(0, 120));
});
page.on("console", (m) => {
  if (m.type() === "error") console.log("CONSOLE:", m.text().slice(0, 200));
});

await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(Number(process.env.SHOOT_SETTLE ?? 3500));

const stops = JSON.parse(process.env.SHOOT_STOPS ?? "[0,0.14,0.3,0.42,0.55,0.72,0.9]");
for (const [i, s] of stops.entries()) {
  await page.evaluate((frac) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max * frac, behavior: "instant" });
  }, s);
  // Lenis eases toward the target; give it time to land and the 3D to settle.
  await page.waitForTimeout(Number(process.env.SHOOT_STEP ?? 2200));
  await page.screenshot({ path: `${OUT}/${String(i).padStart(2, "0")}-${s}.png` });
}
console.log("shots written to", OUT);
await browser.close();
