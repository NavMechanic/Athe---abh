# ATHENA
AI-orchestrated electronics engineering & Virtual OEM. India-first. Power products (SMPS, UPS), ATE, NPD.
Stack: Next.js + TypeScript + Tailwind, static export. Content in MDX/JSON. No backend yet.
Style: premium industrial B2B. Navy, teal, white; amber only for risk. No "AI magic" claims.
Rules: label all sample figures "Illustrative / Demo Data". No fake customers, prices, certifications, stock or tender wins.
Nodes: N1 Market Intelligence, N2 Product Definition, N3 Design Engineering, N4 Quality & Reliability,
N5 Sourcing & Manufacturing, N6 Commercial & Fulfilment, N7 Finance & Costing, N8 Telemetry & Lifecycle.
CTAs: "Discuss a Project" (primary), "Explore ATHENA Demo" (secondary).
Working style: one script per task, no screenshots unless asked, final report under 12 lines.

## Project notes
- Page copy lives in `content/*.json`; components in `src/components` only render it.
- Build: `npm run build` (static export to `out/`). Node is portable at `..\.tools\node` — add it to PATH first.
- Hero video slot: `public/video/hero.mp4` (4:5). Poster: `public/images/hero-poster.svg`.
- `siteUrl` and `contactEmail` in `content/site.json` are placeholders until real values exist.
