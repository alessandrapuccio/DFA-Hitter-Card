# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` (or `npm start`) — Vite dev server. Loads `index.html`, which mounts `src/main.jsx`. In dev mode, `main.jsx` auto-imports `src/data/noda_data.json` and renders `<HitterCard data={...} />` into `#root`.
- `npm run build` — Builds the IIFE bundle for the Shiny host app. **Output goes to `C:/Users/alessandra.puccio/EDGAR/playerdev/Scripts/player-card-generation-portal/www`**, *not* to a local `dist/` or `build/`. `emptyOutDir: false` is set deliberately so the build does not wipe the rest of the Shiny `www/` folder — do not change that.
- `npm run preview` — Serve the built bundle locally.
- No test runner is configured. `test.py` at the repo root is a standalone Python script, unrelated to JS tests, and `App.test.js` / `setupTests.js` are leftover CRA scaffolding that aren't wired up.

The README.md is stale Create React App boilerplate from when the project was scaffolded — the project has since been migrated to Vite. Ignore the README's `npm test` / `npm run eject` claims.

## Architecture

This project produces a **single self-contained JS bundle (`hitter-card.js`)** that is loaded by an external R Shiny app (`player-card-generation-portal`). It is not a standalone web app in production.

**Bundle integration contract (`src/main.jsx`):**
- Build is configured as a Vite library in IIFE format with the global name `HitterCard` and CSS injected by JS (`vite-plugin-css-injected-by-js`) so the Shiny host needs only one `<script>` tag.
- On load, the bundle registers a Shiny custom message handler: `Shiny.addCustomMessageHandler('renderHitterCard', msg => mountCard(msg.divId, msg.data))`.
- Shiny server side calls `session$sendCustomMessage('renderHitterCard', list(divId='card-1', data=playerList))`; the UI side just provides `div(id='card-1')`.
- React roots are cached per `divId` in `roots[]` so repeat messages re-render in place rather than remounting.

**Data shape:** Every component below is driven by a single `data` prop whose canonical shape is `src/data/noda_data.json`. Top-level keys: `player`, `hitting`, `defense`, `baserunning`, `health`, `last_report`, `impact_statement`, `grades`. The R side (see `FORSHINY/*.RData` workspaces) is responsible for producing JSON matching this shape — when adding a field, update both ends.

**Component layout (`src/components/HitterCard.jsx`):** The card is a fixed `width: 1020` 3-column grid:
1. Col 1 — `PlayerBioPanel`, `AnchorTable`, `RollingAvgPlot` (TM wRC+ rolling chart)
2. Col 2 — Hitting: `WRCPlusChart` (vL/vR projection bars) + `TrinityTrident` (swdec/dmg/con shape) on top, `LevelTimeBar` + `ShortDeviationSlider` columns below
3. Col 3 — `BaseballDiamond` *or* `CatchingChart` (switched on `defense.primary_catcher`), then baserunning sliders, then a Health table
4. Bottom bar — Last report + role grades (PRESENT/FUTURE/TE) + tools, all colored via `gradeBg()`

**Shared visual constants live in `src/components/constants.js`:**
- `HEADER_BG = '#1e3a5f'` (navy) and `BORDER` are referenced everywhere. Change them there, not inline.
- `gradeBg(grade)` / `gradeTextColor(grade)` map 20–80 scout grades to background/text colors and are the canonical grade color logic — reuse these rather than reimplementing color thresholds.

**Logos:** Team logos are loaded with `import.meta.glob('../data/logos/*.png', { eager: true })` in `PlayerBioPanel.jsx`, keyed by filename (org abbr). `src/data/logos/` and `FORSHINY/logos/` are duplicates of the same asset set — the `src/data/` copy is the one bundled into the JS.

**Styling:** Most layout is inline `style={{ ... }}` (this is intentional — the bundle ships into a Shiny page where Tailwind classes from elsewhere may collide). Tailwind v3 + PostCSS are configured but used sparingly; prefer inline styles + the `constants.js` palette to stay consistent with existing components.
