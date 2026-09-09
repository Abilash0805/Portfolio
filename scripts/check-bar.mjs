import { launch } from "./lib-browser.mjs";
const browser = await launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await page.goto("http://127.0.0.1:4222", { waitUntil: "load" });
await page.waitForTimeout(12000);
await page.evaluate(() => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: max * 0.62, behavior: "instant" });
});
await page.waitForTimeout(2500);
await page.screenshot({
  path: "/tmp/claude-0/-home-user-Portfolio/25a52f0a-65a3-52c1-982f-6e55b5eb0d9e/scratchpad/bar.png",
  clip: { x: 0, y: 0, width: 390, height: 110 },
});
const info = await page.evaluate(() => {
  const el = [...document.querySelectorAll("a")].find((a) => a.textContent.trim() === "Abilash V");
  return el ? getComputedStyle(el).color : "not found";
});
console.log("bar link colour:", info);
await browser.close();
