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

// Orixen's own service list and identity, taken from the live site.
const SERVICES = [
  "School projects", "Websites", "Study materials",
  "Digital menus", "Portfolios", "Video edits",
];

const NAVY = "#070B16";
const BLUE = "#3b82f6";
const STEEL = "#8a93a8";

// Deterministic starfield — the composition must not change between renders.
let seed = 7;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
const stars = Array.from({ length: 130 }, () => ({
  x: +(rnd() * 1600).toFixed(1),
  y: +(rnd() * 1067).toFixed(1),
  r: +(0.6 + rnd() * 1.5).toFixed(2),
  o: +(0.15 + rnd() * 0.5).toFixed(2),
}));

const orixen = shell(
  `
<div style="position:relative;width:1600px;height:1067px;overflow:hidden;background:
     radial-gradient(120% 90% at 50% 8%, #16224a 0%, ${NAVY} 55%, #04060d 100%)">

  <svg width="1600" height="1067" style="position:absolute;inset:0">
    ${stars.map((s) => `<circle cx="${s.x}" cy="${s.y}" r="${s.r}" fill="#ffffff" opacity="${s.o}"/>`).join("")}
    <g fill="none" stroke="${BLUE}" opacity=".28">
      <ellipse cx="800" cy="560" rx="470" ry="330" stroke-width="1.1"
               transform="rotate(-18 800 560)"/>
      <ellipse cx="800" cy="560" rx="330" ry="460" stroke-width="1.1"
               transform="rotate(24 800 560)"/>
      <ellipse cx="800" cy="560" rx="410" ry="410" stroke-width="0.8" opacity=".5"/>
    </g>
  </svg>

  <div style="position:relative;height:100%;display:flex;flex-direction:column;
              justify-content:space-between;padding:70px 88px">

    <div style="display:flex;align-items:center;gap:18px">
      <div style="width:52px;height:52px;border-radius:13px;background:#0d1striped;
                  background:linear-gradient(150deg,#1b2540,#0a0f1e);
                  border:1px solid rgba(59,130,246,.5);display:grid;place-items:center;
                  color:${BLUE};font-size:25px;font-weight:700">&#593;</div>
      <div>
        <div style="font-size:24px;font-weight:700;letter-spacing:.34em;line-height:1">ORIXEN</div>
        <div style="font-size:12px;font-weight:500;letter-spacing:.46em;color:${BLUE};margin-top:5px">DIGITAL</div>
      </div>
    </div>

    <div style="text-align:center;margin-top:-40px">
      <div style="display:inline-block;border:1px solid rgba(138,147,168,.35);
                  border-radius:999px;padding:9px 26px;margin-bottom:40px">
        <span class="mono" style="color:${STEEL};font-size:12px">
          <span style="color:${BLUE}">&#9679;</span>&nbsp;&nbsp;DESIGNING SOLUTIONS&nbsp;&nbsp;CREATING IMPACT</span>
      </div>
      <div style="font-size:104px;font-weight:800;letter-spacing:-.035em;line-height:.98;
                  background:linear-gradient(180deg,#ffffff,#a9b2c6);
                  -webkit-background-clip:text;-webkit-text-fill-color:transparent">
        Digital Experiences</div>
      <div style="font-size:104px;font-weight:800;letter-spacing:-.035em;line-height:1.02;color:${BLUE}">
        From The Future</div>
      <p style="max-width:760px;margin:34px auto 0;font-size:21px;line-height:1.55;color:#aeb6c8">
        Immersive websites, digital products and creative work — built end to end.</p>
    </div>

    <div>
      <div style="height:1px;background:rgba(138,147,168,.24);margin-bottom:26px"></div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        ${SERVICES.map((s) => `<span class="mono" style="color:${STEEL};font-size:13px">${s.toUpperCase()}</span>`).join("")}
      </div>
    </div>
  </div>
</div>`,
);

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
