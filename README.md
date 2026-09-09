# Abilash V — portfolio

A 3D, scroll-choreographed personal site for Abilash V: Class 12 student,
founder of Orixen Digital, building StudyDesk, and shipping robotics under
competition deadlines.

## Before this goes live

1. **The Orixen preview image.** `public/work/orixen.jpg` is a *designed
   composition built from the real site's identity* — navy space ground,
   electric blue, the ORIXEN DIGITAL lockup and the live service list. It is
   not a screenshot; the sandbox this was built in could not reach
   `orixendigital.vercel.app`. Drop a real screenshot at that exact path to
   replace it; nothing else needs to change.
2. **Check the phone dial code.** `PHONE_HREF` in `src/data/work.ts` assumes
   +91 (India). Change it there if that is wrong.
3. **Set the site origin.** Copy `.env.example` to `.env.local` and set
   `NEXT_PUBLIC_SITE_URL` to the real deployed domain — it backs `metadataBase`,
   so canonical and Open Graph URLs depend on it. On Vercel it is inferred
   automatically and you can skip this. It deliberately falls back to
   `localhost` rather than a guessed domain.

`studydesk.png` and `robotics.png` are intentionally designed visuals (an
interface concept and a signal-path schematic), not screenshots. Regenerate
them any time with `node scripts/build-visuals.mjs`.

## Stack

Next.js 16 (App Router), TypeScript, Tailwind v4, shadcn-convention components
on Radix, React Three Fiber + drei + three, @react-three/postprocessing,
Lenis, GSAP ScrollTrigger, Framer Motion.

## Design system — "Deep Field" 

| Token | Hex | Role |
| --- | --- | --- |
| bg | `#05070E` | Deep-space ground |
| fg | `#EEF2F8` | Body text (17.9:1) |
| muted | `#8A96AD` | Secondary text (6.8:1) |
| accent | `#2563EB` | Fills — white text on it clears 5.17:1 |
| accent-fg | `#60A5FA` | Accent **text** on the dark ground (7.9:1) |
| glow | `#3B82F6` | Glows, borders, charged hairlines |

One electric-blue signal on a cool neutral ramp. Chapters do not invert — they
gain intensity, which is the "progressive reveal" the scroll pattern calls for.
The fill and the text accent are deliberately different values: `#2563EB` is
too dark to read as text on the ground, `#60A5FA` too light to carry white.

Type is three roles: **Sora** for display, **Inter** for body, **JetBrains
Mono** for every technical string. Surfaces are glass — `backdrop-filter` used
to lift a panel off the field, never as decoration on things that are not
panels.

## Components

`components.json`, `src/lib/utils.ts` and `src/components/ui/{button,badge,
separator,accordion,dialog}.tsx` follow shadcn's conventions and dependency set
(Radix + CVA + tailwind-merge), so `npx shadcn@latest add <name>` drops new
components straight in. They were hand-written rather than generated because
`ui.shadcn.com` is unreachable from the sandbox this was built in — the CLI's
`init` and `add` both need that registry.

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

Lenis is the spine. It owns the scroll position, drives GSAP's ticker, feeds
ScrollTrigger, intercepts **every** in-page anchor so navigation eases rather
than jumps (and moves focus to the target for keyboard users), and publishes
velocity to both the 3D layer and CSS. One scroller, one clock.

`lerp: 0.075` is the single value that most decides whether the site feels
expensive or cheap.

Sections claim *disjoint* chapter ranges and write a target the construct
chases, which is why overlapping triggers cannot fight each other. Skills is
pinned with `position: sticky` rather than a GSAP pin, so there is no
pin-spacer to fight Lenis and it survives a resize without a refresh.

## Navigation

Desktop gets a marginal chapter index down the right edge, doubling as the
progress indicator. Small screens get a full menu (`MobileNav`) — the floating
bar senses whether an Ink or Bone chapter is beneath it and inverts, and
opening the menu stops Lenis rather than only hiding body overflow, because a
wheel-driven smooth scroller keeps going otherwise.

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
- Focus indicators are defined **unlayered**. Tailwind's utilities layer
  outranks `@layer base`, so a focus ring defined there gets silently zeroed
  by a utility; and `transition-all` animates `outline-width`, fading the ring
  in over 300ms. Both were real bugs here.
- Measured: the no-WebGL path is FCP ~212 ms, CLS 0. The WebGL path cannot be
  measured meaningfully in the build sandbox — it has no GPU, so SwiftShader
  software rendering dominates the number (it swung 300–1900 ms across runs).
  Measure it on real hardware before trusting a figure.

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
