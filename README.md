# Abilash V — portfolio

A 3D, scroll-choreographed personal site for Abilash V: Class 12 student,
founder of Orixen Digital, building StudyDesk, and shipping robotics under
competition deadlines.

## Before this goes live

Two things need Abilash's input — both are deliberately left blank rather
than guessed at:

1. **Email.** `EMAIL` in `src/data/work.ts` is an empty string. Fill it in and
   the contact section grows an email row automatically. Left empty, the row
   is simply omitted.
2. **The Orixen preview image.** `public/work/orixen.png` is a *designed
   stand-in*, not a screenshot — the sandbox this was built in could not reach
   `orixendigital.vercel.app`. Drop a real screenshot at that exact path to
   replace it; nothing else needs to change.

`studydesk.png` and `robotics.png` are intentionally designed visuals (an
interface concept and a signal-path schematic), not screenshots. Regenerate
them any time with `node scripts/build-visuals.mjs`.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · React Three Fiber +
drei + three · @react-three/postprocessing · GSAP ScrollTrigger · Lenis ·
Framer Motion.

## Design system

| Token | Hex | Role |
| --- | --- | --- |
| Ink | `#0A0C10` | Ground for the WebGL chapters |
| Graphite | `#151920` | Raised surface, hairlines |
| Bone | `#E6E7E2` | Ground for the reading chapters |
| Brass | `#E9A93C` | The one warm signal — solder, amber CRT |
| Oxide | `#8C5A2B` | Deep brass, for accent text on Bone |
| Mist | `#9AA1AC` | Secondary text on Ink |

One warm accent against a cool neutral ramp. The second "accent" is not a
hue — it is the Ink → Bone inversion between chapters, which is what lets the
3D recede after the hero instead of shouting through every section.

Type is two families in three roles: **Bricolage Grotesque** for display
(width axis loaded, so it narrows as it scales), **Geist** for body and
**Geist Mono** for every technical string.

Layout is an engineering drawing: a 12-column grid, hairline rules, section
indices as gutter callouts, and datasheet spec tables. No cards, no
tracked-out caps eyebrows, no arrow-suffixed links, no middle-dot meta
strings.

## The 3D: "The Assembly"

~224 instanced parts that fly in from a scatter shell on load and then morph
between four formations as you scroll:

| Chapter | Formation | Reads as |
| --- | --- | --- |
| Hero | rounded-cube shell | a construct |
| About | component lattice | a module graph |
| Skills | board plane, axis-snapped | PCB traces |
| Work | fanned layers | an edit timeline |

The trick that makes it cohere: **edge pairs are computed once, from the core
formation.** Because the same parts stay wired to the same neighbours through
every morph, transitions read as one circuit rearranging itself rather than
four unrelated shapes cross-fading.

A custom GLSL pulse travels along each part's long axis and along every wire,
phase-offset per instance, with its gain driven by scroll velocity — so the
construct visibly carries more current the faster you move.

The camera rides a single scrubbed CatmullRom spline. `flux.chapter` is the
one source of truth both the camera and the construct read, so they can never
disagree about where in the story you are.

Skills maps its three categories onto three of those formations, so the 3D
changes character with what you are reading.

## Scroll

Lenis drives GSAP's ticker, GSAP drives ScrollTrigger — one clock, nothing
drifts. Sections claim *disjoint* chapter ranges and write a target the
construct chases, which is why overlapping triggers cannot fight each other.
Skills is pinned with `position: sticky` rather than a GSAP pin, so there is
no pin-spacer to fight Lenis and it survives a resize without a refresh.

## Accessibility and performance

- `prefers-reduced-motion` swaps the whole WebGL layer for a static CSS/SVG
  construct, disables Lenis in favour of native scroll, and drops the custom
  cursor. Measured: **234 kB of JS instead of 468 kB** — three.js is never
  fetched.
- Low-tier devices (few cores, little memory, or a small viewport with a
  coarse pointer) get fewer instances, lower DPR, one postprocessing pass,
  and plain images instead of WebGL previews.
- Every colour pair used for text clears WCAG AA 4.5:1 in both chapters; the
  muted label token re-points itself per chapter to stay above the line.
- Full keyboard route through every section with visible focus rings, real
  semantic headings, and all content in the DOM — the canvas is decoration
  and carries no information of its own.
- Measured on the production build: FCP/LCP ~316 ms, CLS 0.

## Commands

```bash
npm run dev             # develop
npm run build && npm start
node scripts/build-visuals.mjs   # regenerate the project preview images
node scripts/shoot.mjs           # screenshot the running site at scroll stops
node scripts/check-a11y.mjs      # tab order, focus rings, heading structure
node scripts/measure.mjs         # FCP / LCP / CLS and transfer size
node scripts/check-split.mjs     # verify the 3D chunk is excluded when unused
```

The `scripts/*.mjs` helpers drive the site with Playwright against a running
server (default port 3777) using the browser already on the machine.
