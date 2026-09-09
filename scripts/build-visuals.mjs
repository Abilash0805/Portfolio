import { launch } from "./lib-browser.mjs";

/**
 * Renders the project visuals to public/work/*.png.
 *
 * These are designed representative compositions, not screenshots. The
 * sandbox this was built in cannot reach orixendigital.vercel.app, so
 * orixen.png is a typographic service board standing in for a real capture —
 * drop a genuine screenshot at the same path to replace it.
 */

const INK = "#0a0c10";
const GRAPHITE = "#151920";
const BONE = "#e6e7e2";
const BRASS = "#e9a93c";
const MIST = "#9aa1ac";

const shell = (body, extra = "") => `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1600px;height:1067px;background:${INK};color:${BONE};
  font-family:ui-sans-serif,"DejaVu Sans",system-ui,sans-serif;overflow:hidden}
.mono{font-family:ui-monospace,"DejaVu Sans Mono",monospace;font-size:15px;letter-spacing:.14em;text-transform:uppercase}
.rule{background:rgba(230,231,226,.14);height:1px;width:100%}
${extra}
</style></head><body>${body}</body></html>`;

const SERVICES = [
  "Website development", "Graphic design", "Branding",
  "Video editing", "Digital content", "Study materials",
  "Billing automation", "Instagram management", "QR menu cards",
];

const orixen = shell(`
<div style="padding:84px 104px;height:100%;display:flex;flex-direction:column;justify-content:space-between">
  <div>
    <div style="font-size:112px;font-weight:800;letter-spacing:-.05em;line-height:.86">Orixen</div>
    <div style="font-size:112px;font-weight:300;letter-spacing:.01em;line-height:.86;color:${MIST}">Digital</div>
    <div style="font-size:25px;line-height:1.5;margin-top:34px;max-width:700px;color:rgba(230,231,226,.72)">
      Websites, brand, video and the systems in between. One studio, run end to end.
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(230,231,226,.13)">
    ${SERVICES.map((s, i) => `<div style="background:${GRAPHITE};padding:42px 30px">
      <div class="mono" style="color:${BRASS};font-size:12px">${String(i + 1).padStart(2, "0")}</div>
      <div style="font-size:24px;font-weight:500;margin-top:16px;letter-spacing:-.01em">${s}</div>
    </div>`).join("")}
  </div>
  <div style="display:flex;justify-content:space-between" class="mono">
    <span style="color:${MIST}">orixendigital.vercel.app</span>
    <span style="color:${MIST}">@orixen_digital.in</span>
  </div>
</div>`);

const studydesk = shell(`
<div style="height:100%;display:flex">
  <div style="width:230px;background:${GRAPHITE};padding:44px 30px;border-right:1px solid rgba(230,231,226,.1)">
    <div style="font-size:22px;font-weight:700;letter-spacing:-.02em">StudyDesk</div>
    <div class="mono" style="color:${BRASS};font-size:11px;margin-top:6px">Study vault</div>
    <div style="margin-top:52px;display:flex;flex-direction:column;gap:6px">
      ${["Dashboard", "Subjects", "Vault", "Papers", "Assistant", "Timetable"].map((s, i) =>
        `<div style="padding:13px 16px;border-radius:3px;font-size:16px;${i === 0
          ? `background:rgba(233,169,60,.14);color:${BRASS};font-weight:600`
          : `color:${MIST}`}">${s}</div>`).join("")}
    </div>
  </div>
  <div style="flex:1;padding:52px 60px">
    <div style="display:flex;justify-content:space-between;align-items:baseline">
      <div>
        <div class="mono" style="color:${MIST};font-size:12px">Thursday, week 14</div>
        <div style="font-size:46px;font-weight:700;letter-spacing:-.035em;margin-top:10px">Due this week</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:60px;font-weight:700;color:${BRASS};letter-spacing:-.04em">68<span style="font-size:26px">%</span></div>
        <div class="mono" style="color:${MIST};font-size:11px">Syllabus covered</div>
      </div>
    </div>
    <div style="margin-top:44px;display:flex;flex-direction:column;gap:1px;background:rgba(230,231,226,.12)">
      ${[["Physics", "Rotational dynamics — problem set", "2 days", 82],
         ["Chemistry", "Electrochemistry notes", "4 days", 45],
         ["Maths", "Definite integrals revision", "Tomorrow", 21],
         ["CS", "SQL joins practical record", "6 days", 90]].map(([sub, task, due, pct]) =>
        `<div style="background:${INK};padding:22px 26px;display:grid;grid-template-columns:120px 1fr 130px 190px;align-items:center;gap:24px">
          <div class="mono" style="color:${BRASS};font-size:12px">${sub}</div>
          <div style="font-size:18px">${task}</div>
          <div class="mono" style="color:${MIST};font-size:12px">${due}</div>
          <div style="height:4px;background:rgba(230,231,226,.14)">
            <div style="height:100%;width:${pct}%;background:${BRASS}"></div>
          </div>
        </div>`).join("")}
    </div>
    <div style="margin-top:42px;display:grid;grid-template-columns:1fr 1fr;gap:26px">
      <div style="background:${GRAPHITE};padding:30px;border-left:2px solid ${BRASS}">
        <div class="mono" style="color:${BRASS};font-size:11px">Assistant</div>
        <div style="font-size:19px;margin-top:14px;line-height:1.5;color:rgba(230,231,226,.82)">
          &ldquo;Explain rotational inertia using the notes I uploaded on Tuesday.&rdquo;</div>
      </div>
      <div style="background:${GRAPHITE};padding:30px">
        <div class="mono" style="color:${MIST};font-size:11px">Vault</div>
        <div style="font-size:19px;margin-top:14px;line-height:1.5;color:rgba(230,231,226,.82)">
          184 files synced across 3 devices. Last write 2 minutes ago.</div>
      </div>
    </div>
    <div style="margin-top:44px">
      <div class="mono" style="color:${MIST};font-size:11px;margin-bottom:18px">Week at a glance</div>
      <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:10px">
        ${[["Mon", [1, 0, 1]], ["Tue", [1, 1, 0]], ["Wed", [0, 1, 1]],
           ["Thu", [1, 1, 1]], ["Fri", [1, 0, 0]], ["Sat", [0, 1, 0]]].map(([day, slots]) =>
          `<div>
             <div class="mono" style="color:${MIST};font-size:11px;margin-bottom:10px">${day}</div>
             ${slots.map((on) => `<div style="height:34px;margin-bottom:6px;background:${
               on ? "rgba(233,169,60,.22)" : "rgba(230,231,226,.05)"
             };${on ? `border-left:2px solid ${BRASS}` : ""}"></div>`).join("")}
           </div>`).join("")}
      </div>
    </div>
  </div>
</div>`);

// Signal path drawn as a schematic: sensing -> controller -> actuation.
const node = (x, y, w, h, title, sub, accent) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${GRAPHITE}"
        stroke="${accent || "rgba(230,231,226,.22)"}" stroke-width="1.5"/>
  <text x="${x + 22}" y="${y + 38}" fill="${accent || BONE}"
        font-family="ui-monospace,monospace" font-size="15" letter-spacing="2.4">${title}</text>
  <text x="${x + 22}" y="${y + 68}" fill="${MIST}"
        font-family="ui-sans-serif,sans-serif" font-size="17">${sub}</text>`;

const robotics = shell(`
<svg width="1600" height="1067" viewBox="0 0 1600 1067">
  <defs>
    <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="rgba(230,231,226,.05)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1600" height="1067" fill="${INK}"/>
  <rect width="1600" height="1067" fill="url(#g)"/>

  <text x="104" y="118" fill="${BRASS}" font-family="ui-monospace,monospace"
        font-size="15" letter-spacing="3">SIGNAL PATH — COMPETITION BUILD</text>
  <line x1="104" y1="148" x2="1496" y2="148" stroke="rgba(230,231,226,.16)"/>

  ${node(104, 250, 320, 110, "IR ARRAY", "Line and edge detection")}
  ${node(104, 430, 320, 110, "ULTRASONIC", "HC-SR04 range")}
  ${node(104, 610, 320, 110, "DHT / LDR", "Environment")}

  ${node(640, 390, 320, 240, "ESP32", "Control and logic", BRASS)}
  <g fill="${MIST}" font-family="ui-monospace,monospace" font-size="13" letter-spacing="1.6">
    <text x="662" y="586">240MHz</text>
    <text x="770" y="586">WIFI</text>
    <text x="856" y="586">BT</text>
  </g>

  ${node(1176, 250, 320, 110, "MOTOR DRIVER", "L298N, DC and servo")}
  ${node(1176, 430, 320, 110, "OLED / LCD", "Status readout")}
  ${node(1176, 610, 320, 110, "HC-05", "Mobile control")}

  <g stroke="${BRASS}" stroke-width="2" fill="none" opacity=".85">
    <path d="M424 305 H512 V450 H640"/>
    <path d="M424 485 H566 V510 H640"/>
    <path d="M424 665 H540 V570 H640"/>
    <path d="M960 450 H1064 V305 H1176"/>
    <path d="M960 510 H1116 V485 H1176"/>
    <path d="M960 570 H1090 V665 H1176"/>
  </g>
  <g fill="${BRASS}">
    ${[[512, 450], [566, 510], [540, 570], [1064, 305], [1116, 485], [1090, 665]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5"/>`).join("")}
  </g>

  <line x1="104" y1="880" x2="1496" y2="880" stroke="rgba(230,231,226,.16)"/>
  <g fill="${MIST}" font-family="ui-monospace,monospace" font-size="14" letter-spacing="2.4">
    <text x="104" y="936">ARDUINO UNO</text>
    <text x="340" y="936">ESP32</text>
    <text x="500" y="936">NODEMCU</text>
    <text x="1496" y="936" text-anchor="end">BUILT INSIDE THE TIME LIMIT</text>
  </g>
</svg>`);

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1067 } });
for (const [name, html] of Object.entries({ orixen, studydesk, robotics })) {
  await page.setContent(html, { waitUntil: "load" });
  await page.screenshot({ path: `public/work/${name}.png` });
  console.log("rendered", name);
}
await browser.close();
