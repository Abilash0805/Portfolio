export type Project = {
  id: string;
  index: string;
  name: string;
  role: string;
  /** One line that earns the scroll. */
  hook: string;
  body: string[];
  specs: { label: string; value: string }[];
  image: string;
  alt: string;
  links: { label: string; href: string }[];
  /** Chapter tint used by the WebGL preview. */
  accent: string;
};

export const PROJECTS: Project[] = [
  {
    id: "orixen",
    index: "01",
    name: "Orixen Digital",
    role: "Founder — runs the whole thing",
    hook: "A digital services studio I run, not a project I submitted.",
    body: [
      "Orixen Digital is my own brand. Clients come with a problem — no website, a menu that needs reprinting every time a price changes, an Instagram nobody is running — and I handle it end to end. Scoping, design, build, delivery, and the invoice after.",
      "It covers more ground than most agencies my size: sites and landing pages, branding and graphic work, video editing, study material, QR menu cards that update without a reprint, billing automation, and ongoing account management. One person, but the output is meant to look like a team.",
    ],
    specs: [
      { label: "Role", value: "Founder, designer, developer, editor" },
      {
        label: "Services",
        value:
          "Web development, branding & graphic design, video editing, content, study materials, technical support, billing automation, Instagram management, QR menu cards",
      },
      { label: "Stack", value: "Next.js, Vercel, Firebase, Adobe suite" },
      { label: "Status", value: "Live and taking clients" },
    ],
    image: "/work/orixen.jpg",
    alt: "The Orixen Digital website home page",
    links: [
      { label: "orixendigital.vercel.app", href: "https://orixendigital.vercel.app" },
      {
        label: "@orixen_digital.in",
        href: "https://instagram.com/orixen_digital.in",
      },
    ],
    accent: "#e9a93c",
  },
  {
    id: "studydesk",
    index: "02",
    name: "StudyDesk / Study Vault",
    role: "Solo build — design and code",
    hook: "The study dashboard I wanted to exist while I was studying.",
    body: [
      "StudyDesk is a student dashboard built around the way work actually happens the week before an exam: what is due, what is unfinished, and what you have avoided for three days. Not a habit tracker with a streak counter.",
      "Google auth so there is nothing to set up, Firebase so your work is on every device you open, and a Claude integration that reads your own material rather than answering from nowhere. Study Vault is the storage side — your notes, papers and resources in one place instead of four apps and a WhatsApp chat.",
    ],
    specs: [
      { label: "Role", value: "Product, interface, and implementation" },
      { label: "Stack", value: "Next.js, Firebase, Google Auth, Claude API" },
      {
        label: "Core",
        value:
          "Student dashboard, real-time sync, AI study assistance, resource vault",
      },
      { label: "Status", value: "In active development" },
    ],
    image: "/work/studydesk.png",
    alt: "StudyDesk interface concept showing the student dashboard layout",
    links: [],
    accent: "#8fb6ff",
  },
  {
    id: "robotics",
    index: "03",
    name: "Robotics & Engineering",
    role: "Built to a deadline, in a room, with a timer running",
    hook: "Hardware does not care how good your plan was.",
    body: [
      "Arduino, ESP32 and NodeMCU builds: sensors in, logic in the middle, motors and displays out, Bluetooth on top so it can be driven from a phone. The interesting part is never the wiring diagram — it is the debugging when a sensor reads fine on the bench and lies on the floor.",
      "Most of this was built under competition constraints, which is a different skill from building it properly at home. Fixed hours, parts you brought and nothing else, and a demo that has to run in front of judges on the first attempt. You learn to build the thing that will survive the table, not the thing that is elegant.",
    ],
    specs: [
      { label: "Boards", value: "Arduino Uno, ESP32, NodeMCU" },
      {
        label: "Sensing",
        value: "IR, ultrasonic, temperature and humidity, LDR",
      },
      { label: "Output", value: "Servo and DC motors, OLED and LCD displays" },
      { label: "Link", value: "HC-05 Bluetooth control from mobile" },
      {
        label: "Constraint",
        value: "Built, wired and debugged inside competition time limits",
      },
    ],
    image: "/work/robotics.png",
    alt: "Schematic drawing of the robotics control system signal path",
    links: [],
    accent: "#7fd4b8",
  },
];

export type SkillGroup = {
  id: string;
  index: string;
  title: string;
  line: string;
  items: string[];
};

export const SKILLS: SkillGroup[] = [
  {
    id: "software",
    index: "A",
    title: "Web & software",
    line: "Where most of it ships. I build the front, wire the back, and put it online myself.",
    items: [
      "HTML",
      "CSS",
      "JavaScript",
      "PHP",
      "SQL",
      "Python",
      "Git & GitHub",
      "Vercel",
      "Netlify",
      "Firebase",
    ],
  },
  {
    id: "hardware",
    index: "B",
    title: "Hardware & electronics",
    line: "Microcontrollers, sensors and motors — the part where a mistake smells like burning.",
    items: [
      "Arduino",
      "ESP32",
      "NodeMCU",
      "Sensor integration",
      "Motor drivers",
      "Bluetooth (HC-05)",
      "OLED & LCD",
      "Power and wiring",
      "Automation logic",
    ],
  },
  {
    id: "creative",
    index: "C",
    title: "Creative & design",
    line: "The reason the work looks like something, instead of just working.",
    items: [
      "Brand identity",
      "Graphic design",
      "UI design",
      "Professional video editing",
      "Edit pacing & sound",
      "Thumbnails & covers",
      "Content systems",
      "Print & QR collateral",
    ],
  },
];

/** Personal and studio contact. Phone is assumed +91 (India) — change the
 *  dial code here if that is wrong. */
export const PHONE_DISPLAY = "+91 97890 10266";
export const PHONE_HREF = "tel:+919789010266";

export const CONTACT_LINKS = [
  { label: "Phone", value: PHONE_DISPLAY, href: PHONE_HREF },
  {
    label: "Instagram",
    value: "@wanderer_on_wheels85",
    href: "https://instagram.com/wanderer_on_wheels85",
  },
  {
    label: "Studio",
    value: "@orixen_digital.in",
    href: "https://instagram.com/orixen_digital.in",
  },
  {
    label: "Orixen",
    value: "orixendigital.vercel.app",
    href: "https://orixendigital.vercel.app",
  },
  {
    label: "GitHub",
    value: "github.com/Abilash0805",
    href: "https://github.com/Abilash0805",
  },
];

/** What the marquee band cycles through. */
export const MARQUEE = [
  "Websites",
  "Brand identity",
  "Video editing",
  "Study materials",
  "QR menu cards",
  "Portfolios",
  "Billing automation",
  "Robotics",
  "Instagram management",
];
