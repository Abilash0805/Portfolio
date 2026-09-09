import { launch } from "./lib-browser.mjs";
const browser = await launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
page.on("pageerror", (e) => console.log("PAGEERROR:", e.message.split("\n")[0]));
await page.goto("http://127.0.0.1:4111", { waitUntil: "load" });
await page.waitForTimeout(14000);
await page.getByRole("button", { name: /menu/i }).click();
await page.waitForTimeout(1400);
await page.screenshot({ path: "/tmp/claude-0/-home-user-Portfolio/25a52f0a-65a3-52c1-982f-6e55b5eb0d9e/scratchpad/mob2/menu.png" });
// Scroll must be locked while the menu is open.
const before = await page.evaluate(() => window.scrollY);
await page.mouse.wheel(0, 600);
await page.waitForTimeout(900);
const after = await page.evaluate(() => window.scrollY);
console.log("scroll locked while menu open:", before === after, `(${before} -> ${after})`);
await browser.close();
