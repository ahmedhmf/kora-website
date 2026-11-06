# KORA Website

An Angular single-page site for KORA match balls and handballs. The seven full-screen sections share the same scroll-snap navigation and reveal animations.

## Sections

Each section lives in `src/app/features/landing/sections/`:

1. `hero-section` — Match Balls hero
2. `dna-section` — Performance With Purpose
3. `identity-section` — Culture, Performance, Expression
4. `footballs-section` — Football product features
5. `handball-section` — More Than a Game
6. `handball-balls-section` — Handball product features
7. `footer-section` — Newsletter panel

The ordered sections and scroll behavior are maintained in:

- `src/app/features/landing/landing-page/` — section composition, progress, scroll-snap and keyboard navigation
- `src/app/core/store/scroll.store.ts` — section metadata and active/visited state
- `src/app/shared/components/scroll-nav-dots/` — right-side navigation dots
- `src/app/layout/navbar/` — KORA logo that returns to the first section

KORA artwork and SVG marks are stored in `public/assets/kora/`. Site-wide styles and the Chakra Petch font are configured in `src/styles.scss`.

## Development

```bash
npm ci
npm start
```

Build the production bundle with `npm run build`; run unit tests with `npm test`.

## Newsletter

The footer validates the email field and privacy checkbox, but **does not submit or store addresses** yet. Connect a subscription provider before enabling real signups.
