# AGENTS.md - AI Agent Guide for ExplAIn Sims

## Project Overview

**ExplAIn Sims** is a Progressive Web App (PWA) providing interactive physics tools, simulations, and educational games. The site is a static site with no build system, deployed via GitHub Pages.

- **Tech Stack**: Vanilla JavaScript, HTML5, CSS3 (no frameworks, no bundler)
- **Deployment**: GitHub Pages (direct file serving)
- **External Services**: Supabase (leaderboards) - API calls are NOT cached


## Critical Rules

### Service Worker Cache (`sw.js`)

The site uses a service worker for offline support. Assets are served **cache-first**, so users won't see updates unless the cache is invalidated.

**Every time you modify a file listed in `ASSETS_TO_CACHE` in `sw.js`, you MUST bump the `BUILD_ID` timestamp at the top of `sw.js` as your final step before finishing. This is easy to forget — do not skip it.** Without this, returning users will continue to be served the old cached version.

```javascript
// sw.js - update this timestamp whenever any cached asset changes
const BUILD_ID = 'YYYY-MM-DDTHH:MM:SSZ';
```

When adding a new published page, also add its path to the `ASSETS_TO_CACHE` array.

**Cache URLs are exact-match keys.** If an HTML file changes any CDN script/style URL, update the exact same URL in `ASSETS_TO_CACHE` (including version/path/query string), then bump `BUILD_ID`.

If a cached page depends on local media assets (audio/video/images/fonts) for core UX, add those file paths to `ASSETS_TO_CACHE` as well.

### No Build System

Edit files directly. There is no npm, webpack, or any compilation step. Do not introduce one.

### Self-Contained Pages

Each HTML file in the repo is a complete, standalone application. Complex tools (e.g. PanPhyPlot) split their JS/CSS into modules under a subfolder, but the entry point is always a single HTML file.

PanPhyPlot curve fitting uses a shared numeric helper module at `panphy/panphyplot/js/fit-core.js`, consumed by both `curve-fitting.js` (main-thread fallback) and `fit-worker.js` (worker path).

### Filename Hashes

Module files must use **stable, unhashed filenames** (e.g. `copy.js`, not `copy.ab12.js`). Cache busting is handled exclusively via the `BUILD_ID` in `sw.js`. Do not rely on file hash changes for updates.

### Published vs Unlisted Pages

Not every HTML file in the repo is currently part of the published navigation.

- **Published pages** are linked from `index.html` and listed in `sitemap.xml`
- Only published pages should include `<script src="/assets/sw-register.js" defer></script>` and be tracked in `ASSETS_TO_CACHE`
- Unlisted/internal pages should stay outside service-worker registration and pre-cache lists unless explicitly promoted

If you promote an unlisted page to production, treat it as a full launch task:
1. Add `<script src="/assets/sw-register.js" defer></script>` if missing
2. Add route + required assets to `ASSETS_TO_CACHE`
3. Bump `BUILD_ID` in `sw.js`
4. Link it from `index.html`
5. Add it to `sitemap.xml`

## Coding Conventions

- **Variables/functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **CSS theming**: Use CSS custom properties (`--bg-color`, `--text-main`, `--brand-primary`, `--brand-accent`); hardcoded colors are allowed upon request
- **Theme toggle**: `data-theme` attribute on `<html>`, persisted to localStorage
- **Mobile-first**: Touch targets 48px+, responsive design
- **Three.js canvas resize**: Always use `renderer.setSize(w, h, false)` (prevents inline CSS causing resize loops on iPhone). Canvas CSS needs `height: 0; flex: 1; min-height: 0` so flexbox controls sizing
- **Offline-first**: New features must work without network
- **External libraries**: Loaded from CDNs (Plotly, MathJax, etc.), not bundled
- **No absolute paths in output**: For security, never show the full absolute file path when summarizing code changes. Use repo-relative paths instead (e.g. `tools/markdown_editor/js/main.js`)


## Directory Layout

```
/
├── index.html              # Landing page
├── sw.js                   # Service Worker (update BUILD_ID on changes!)
├── manifest.json           # PWA config
├── appcm.html              # AP Physics C: Mechanics gallery page
├── tools.html              # Tools gallery page
├── teachers.html           # Teachers gallery page
├── panphy.html             # PanPhy tools gallery page
├── api.html                # API gallery page
├── assets/                 # Icons, logos, sw-register.js
├── appcm/                  # AP Physics C: Mechanics simulations
│   └── *.html              # physical_pendulum, elevator_physics, lorentz_learn, etc.
├── panphy/                 # PanPhy tools
│   ├── panphyplot.html     # Entry point → panphyplot/ (modular JS/CSS)
│   ├── panphyplot/         # Modular subfiles (js/, css/)
│   ├── motion_tracker.html
│   ├── superposition.html
│   ├── lorentz.html
│   ├── timer.html
│   └── visualizer.html
└── teachers/               # Teacher utilities
    └── *.html              # cmdterm_wordle, jeopardy
```

## Testing Locally

Run a simple HTTP server to test service workers and absolute paths:

```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

## Adding a New Page

1. If the page will be published, place it in the appropriate public directory and include service worker registration via shared loader: `<script src="/assets/sw-register.js" defer></script>`
2. Use the standard CSS theme variables
3. If published, add the path to `ASSETS_TO_CACHE` in `sw.js`
4. Bump the `BUILD_ID` in `sw.js` after published/cached asset changes
5. Add a link from `index.html`
6. Add a `<loc>` entry to `sitemap.xml` if the page is public

## Git Workflow

- **Main branch**: Production (auto-deployed to GitHub Pages)
- **Feature branches**: Use `claude/` or `codex/` prefixes for AI-generated code
- **Pull requests**: Required for merging to main
