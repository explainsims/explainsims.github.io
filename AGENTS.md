# AGENTS.md - AI Agent Guide for ExplAIn Sims

## Project Overview

**ExplAIn Sims** is a site providing interactive physics tools, simulations, and educational games. The site is a static site with no build system, deployed via GitHub Pages.

- **Tech Stack**: Vanilla JavaScript, HTML5, CSS3 (no frameworks, no bundler)
- **Deployment**: GitHub Pages (direct file serving)
- **External Services**: Supabase (leaderboards)


## Critical Rules

### No Build System

Edit files directly. There is no npm, webpack, or any compilation step. Do not introduce one.

### Self-Contained Pages

Each HTML file in the repo is a complete, standalone application. Complex tools (e.g. PanPhyPlot) split their JS/CSS into modules under a subfolder, but the entry point is always a single HTML file.

PanPhyPlot curve fitting uses a shared numeric helper module at `panphy/panphyplot/js/fit-core.js`, consumed by both `curve-fitting.js` (main-thread fallback) and `fit-worker.js` (worker path).

### Published vs Unlisted Pages

Not every HTML file in the repo is currently part of the published navigation.

- **Published pages** are linked from `index.html` and listed in `sitemap.xml`
- Unlisted/internal pages should stay out of the gallery pages unless explicitly promoted

If you promote an unlisted page to production:
1. Link it from the appropriate gallery page
2. Add it to `sitemap.xml`

## Coding Conventions

- **Variables/functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **CSS theming**: Use CSS custom properties (`--bg-color`, `--text-main`, `--brand-primary`, `--brand-accent`); hardcoded colors are allowed upon request
- **Theme toggle**: `data-theme` attribute on `<html>`, persisted to localStorage
- **Mobile-first**: Touch targets 48px+, responsive design
- **Three.js canvas resize**: Always use `renderer.setSize(w, h, false)` (prevents inline CSS causing resize loops on iPhone). Canvas CSS needs `height: 0; flex: 1; min-height: 0` so flexbox controls sizing
- **External libraries**: Loaded from CDNs (Plotly, MathJax, etc.), not bundled
- **No absolute paths in output**: For security, never show the full absolute file path when summarizing code changes. Use repo-relative paths instead (e.g. `tools/markdown_editor/js/main.js`)


## Directory Layout

```
/
├── index.html              # Landing page
├── manifest.json           # PWA config
├── appcm.html              # AP Physics C: Mechanics gallery page
├── tools.html              # Tools gallery page
├── fun.html                # Fun gallery page (games and other fun apps)
├── panphy.html             # PanPhy tools gallery page
├── api.html                # API gallery page
├── assets/                 # Icons, logos
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
└── fun/                    # Games and other fun apps
    └── *.html              # cmdterm_wordle, jeopardy
```

## Testing Locally

Run a simple HTTP server:

```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

## Adding a New Page

1. If the page will be published, place it in the appropriate public directory
2. Use the standard CSS theme variables
3. Add the shared footer just before `</body>`: `<div id="site-footer"></div>` followed by `<script src="/assets/footer.js"></script>`. Do **not** write an inline `<footer>` element or a page-specific `footer { }` CSS block.
4. Add a link from the relevant gallery page
5. Add a `<loc>` entry to `sitemap.xml` if the page is public

## Git Workflow

- **Main branch**: Production (auto-deployed to GitHub Pages)
- **Feature branches**: Use `claude/` or `codex/` prefixes for AI-generated code
- **Pull requests**: Required for merging to main
