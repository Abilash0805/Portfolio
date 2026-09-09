import { launch } from "./lib-browser.mjs";
const browser = await launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:4888", { waitUntil: "load" });
await page.waitForTimeout(6000);

// Walk the tab order and report what receives focus and whether it is visible.
const seen = [];
for (let i = 0; i < 12; i++) {
  await page.keyboard.press("Tab");
  await page.waitForTimeout(120); // let any transition settle before measuring
  const info = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || "").trim().slice(0, 34),
      outline: cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0,
      onScreen: r.width > 0 && r.height > 0,
    };
  });
  if (info) seen.push(info);
}
for (const s of seen) {
  console.log(
    `${s.outline ? "focus-ring" : "NO-RING  "} ${s.onScreen ? "visible" : "OFFSCREEN"}  <${s.tag}> ${s.text}`,
  );
}
await page.screenshot({ path: "/tmp/claude-0/-home-user-Portfolio/25a52f0a-65a3-52c1-982f-6e55b5eb0d9e/scratchpad/focus.png" });

// Heading order + landmark sanity
const doc = await page.evaluate(() => ({
  headings: [...document.querySelectorAll("h1,h2,h3")].map((h) => h.tagName + ": " + h.textContent.trim().slice(0, 40)),
  imgsMissingAlt: [...document.querySelectorAll("img")].filter((i) => !i.alt).length,
  main: !!document.querySelector("main"),
  lang: document.documentElement.lang,
}));
console.log("\nlandmarks: main=" + doc.main + " lang=" + doc.lang + " imgs-missing-alt=" + doc.imgsMissingAlt);
console.log(doc.headings.join("\n"));
await browser.close();
