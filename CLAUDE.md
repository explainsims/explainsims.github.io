# CLAUDE.md - AI Assistant Guide for ExplAIn Sims

## Project Overview

**ExplAIn Sims** is a Progressive Web App (PWA) providing interactive physics tools, simulations, and educational games for teachers and students. The site is designed to work offline after the first visit.

- **Repository**: `explainsims.github.io` (GitHub Pages)
- **Type**: Static site / PWA with no build system
- **Tech Stack**: Vanilla JavaScript, HTML5, CSS3
- **Deployment**: GitHub Pages (direct file serving)

## Directory Structure (incomplete)

```
/
├── index.html              # Main landing page
├── sw.js                   # Service Worker for offline support
├── manifest.json           # PWA configuration
├── _headers                # HTTP headers configuration
├── robots.txt              # Search engine crawl rules
├── sitemap.xml             # Site sitemap
│
├── assets/
│   ├── favicon.png             # Site favicon (48x48)
│   ├── ExplAIn Sims.png        # App icon (512x512)
│   ├── apple-touch-icon.png    # iOS icon (180x180)
│   └── sw-register.js          # Service Worker registration script
│
├── appcm/                  # AP Physics C: Mechanics simulations (AP PCM tab)
│   ├── superposition.html
│   ├── physical_pendulum.html
│   ├── lorentz.html
│   └── lorentz_learn.html  # Lorentz sim learning companion
│
│   # Each tab has its own directory. Future non-AP PCM simulations
│   # go in the directory named after their tab.
│
├── teachers/           # Teacher utilities


```

## Published vs Unlisted Routes

Not every HTML file in the repo is currently treated as a published page.

- **Published pages** are linked from `index.html` and listed in `sitemap.xml`
- Only published pages should include `<script src="/assets/sw-register.js" defer></script>` and be included in `sw.js` `ASSETS_TO_CACHE`
- Unlisted/internal pages should remain outside SW registration and pre-cache unless intentionally promoted

If you promote an unlisted page to production, do all of the following:
1. Add `<script src="/assets/sw-register.js" defer></script>` if missing
2. Add page path + required assets to `ASSETS_TO_CACHE` in `sw.js`
3. Bump `BUILD_ID` in `sw.js`
4. Add a card/link in `index.html`
5. Add the page URL to `sitemap.xml`

## Tech Stack & Dependencies

### Core Technologies
- **HTML5**: Semantic markup, inline styles
- **CSS3**: CSS custom properties for theming
- **Vanilla JavaScript**: No frameworks (React, Vue, etc.)
- **Service Workers**: Offline functionality

### External Libraries (CDN)
- `Plotly.js` (2.29.1) - Graphing and data visualization
- `Math.js` (11.5.0) - Mathematical computations
- `MathJax` (2.7.5 in PanPhyPlot, 3.x in Markdown Editor) - LaTeX equation rendering
- `Highlight.js` (11.8.0) - Code syntax highlighting
- `DOMPurify` (2.3.4) - HTML sanitization
- `Marked` (4.3.0) - Markdown parsing
- `Chart.js` - Data visualization
- `html2canvas` (1.4.1) - HTML-to-canvas screenshots
- `Three.js` (0.161.0) - 3D rendering (Collision sim)
- `MediaPipe` (0.10.32) - Hand tracking (Collision sim)
- `Supabase.js` - Backend for leaderboards

## Coding Conventions

### HTML File Structure
Each application is self-contained in a single HTML file:

```html
<!DOCTYPE html>
<html data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App Title</title>
    <!-- Include only for published pages -->
    <script src="/assets/sw-register.js" defer></script>
    <style>/* CSS with variables for theming */</style>
</head>
<body>
    <!-- HTML content -->
    <script src="https://cdn..."></script>
    <script>/* App logic */</script>
</body>
</html>
```

### CSS Theming System
All apps use CSS custom properties for light/dark theme support:

```css
:root {
  --bg-color: #f8f9fa;
  --text-main: #2d3436;
  --brand-primary: #6c5ce7;
  --brand-accent: #00cec9;
}

[data-theme="dark"] {
  --bg-color: #0f1014;
  --text-main: #dfe6e9;
}
```

Theme is toggled via `data-theme` attribute on `<html>` and persisted to localStorage.

### JavaScript Naming Conventions
- **Variables**: camelCase (`rawData`, `activeSet`)
- **Functions**: camelCase (`fitCurve()`, `plotGraph()`)
- **Constants**: UPPER_SNAKE_CASE (`CACHE_NAME`, `STORAGE_KEY`)
- **State objects**: Centralized global objects

### Modular Architecture
For complex tools, code is split into modules:

**PanPhyPlot:**
```
panphyplot.html (imports scripts)
├── js/state.js            # State management & localStorage
├── js/main.js             # App initialization
├── js/plotting.js         # Rendering logic
├── js/fit-core.js         # Shared fit math helpers (used by main thread + worker)
├── js/curve-fitting.js    # Fit orchestration and main-thread fallback
├── js/data-processing.js  # Data import/export
├── js/fit-worker.js       # Web Worker for curve fitting
├── js/latex-rendering.js  # LaTeX output
├── js/ui.js               # UI interactions
└── css/panphyplot.css     # Styling
```


## Service Worker & Caching

**File**: `sw.js`
**Cache Version**: `panphy-labs-<BUILD_ID>` where `BUILD_ID` is a timestamp string

### Caching Strategy
- **Install**: Pre-caches core assets listed in `ASSETS_TO_CACHE`
- **Navigations**: Network-first, fallback to cache
- **Assets**: Cache-first, then fetch and update
- **Exclusions**: `/beta/*`, Dodge game routes, and Supabase API calls (always fetch fresh)

### When Modifying Any Cached Asset
Any time you change a file listed in `ASSETS_TO_CACHE`, **bump the `BUILD_ID` timestamp** at the top of `sw.js`. Without this, returning users will keep getting the old cached version.

```javascript
const BUILD_ID = 'YYYY-MM-DDTHH:MM:SSZ';  // Update this on every change
```

### Cache-Manifest Accuracy Rules
1. External CDN URLs must match exactly between HTML and `ASSETS_TO_CACHE` (version/path/query included)
2. If a cached page depends on local media assets (`.mp3`, `.webm`, images, fonts) for core UX, add those assets to `ASSETS_TO_CACHE`
3. If `assets/sw-register.js` is updated (it is cached), bump `BUILD_ID` in `sw.js`
4. Never add `/beta/*` paths to `ASSETS_TO_CACHE`

### When Adding New Pages
1. Unless explicitly requested to publish and list on `index.html`, create the new page under `/beta`
2. Keep `/beta` pages out of SW registration and `ASSETS_TO_CACHE`
3. For published pages, add the new page path to `ASSETS_TO_CACHE` array in `sw.js`
4. Bump the `BUILD_ID` timestamp for published/cached additions

```javascript
const ASSETS_TO_CACHE = [
  // ... existing assets ...
  '/tools/new_tool.html',  // Add new pages here
];
```

## Development Workflow

### No Build System
This is a pure static site. Changes are made directly to HTML/CSS/JS files with no compilation or bundling step.

### Git Workflow
- **Main branch**: Production (deployed to GitHub Pages)
- **Feature branches**: Use `claude/` or `codex/` prefixes for AI-generated code
- **Pull requests**: Required for merging changes

### Testing Changes Locally
Serve the files with any static server:
```bash
python3 -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000` in a browser.

## Common Tasks

### Adding a New Tool/Page
1. If it will be published, create/move it in the appropriate public directory (`appcm/` for AP PCM sims, `tools/`, `teachers/`, `tools/`, or a future tab directory)
2. If it will be published from `index.html`, include `<script src="/assets/sw-register.js" defer></script>` in `<head>`
3. Use the standard theming CSS variables
4. If published, add to `sw.js` `ASSETS_TO_CACHE` array and bump `BUILD_ID`
5. Add link to `index.html` in the appropriate section
6. Add URL to `sitemap.xml` if page is public

### Updating the Theme System
Theme colors are defined in CSS `:root` and `[data-theme="dark"]` selectors. Key variables:
- `--bg-color`: Background
- `--text-main`: Primary text
- `--brand-primary`: Primary accent (#6c5ce7 indigo)
- `--brand-accent`: Secondary accent (#00cec9 teal)

### Working with PanPhyPlot
The most complex tool has modular architecture:
- State management in `js/state.js` with debounced localStorage persistence
- Plotting in `js/plotting.js` using Plotly
- Shared fitting primitives in `js/fit-core.js`
- Curve fitting orchestration in `js/curve-fitting.js` (with `js/fit-worker.js` for heavy tasks)

### Touch/Mobile Considerations
- Prevent double-tap zoom: Already implemented in dodge game
- Touch targets should be 48px+ for accessibility
- Use `viewport-fit: cover` for edge-to-edge on notched devices

### Three.js Canvas Resize Pattern
When using Three.js with a `ResizeObserver`, always follow this pattern to prevent an infinite resize loop on mobile (especially iPhone where `overflow: auto` and `height: auto` are used):
1. Set `height: 0` on the canvas CSS alongside `flex: 1; min-height: 0` — this ensures flexbox grows it from zero rather than from the canvas's intrinsic attribute size
2. Call `renderer.setSize(w, h, false)` — the `false` third argument prevents Three.js from setting inline `style.width`/`style.height` on the canvas, which would override flexbox constraints and trigger a feedback loop

## Important Files Reference

| File | Purpose |
|------|---------|
| `index.html` | Main landing page with links to all tools |
| `sw.js` | Service Worker - update cache list when adding pages |
| `manifest.json` | PWA metadata (name, icons, display mode) |
| `panphy/panphyplot/` | Complex plotting tool, good reference for modular patterns |

## Key Patterns

### State Persistence
```javascript
const STORAGE_KEY = 'app-state';
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : defaultState;
}
```

### Theme Toggle
```javascript
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}
```

### Service Worker Registration
```html
<script src="/assets/sw-register.js" defer></script>
```
Use this only on published pages.

### Standard App Banner (REQUIRED for every app)

Every app page must use this exact header structure. Do not invent a custom nav or heading — always copy this pattern.

**`<head>` boilerplate** (before `<style>`):
```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#F4F4F8">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <script>
    (function() {
      if (localStorage.getItem('<APP-SLUG>-dark')) {
        document.documentElement.setAttribute('data-theme', 'dark');
        var tc = document.querySelector('meta[name="theme-color"]');
        var sb = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (tc) tc.setAttribute('content', '#111118');
        if (sb) sb.setAttribute('content', 'black-translucent');
      }
    })();
    </script>
    <title>App Name — ExplAIn Sims</title>
    <link rel="icon" type="image/png" href="/assets/favicon.png">
    <script src="/assets/sw-register.js" defer></script>  <!-- published pages only -->
```

**Banner CSS** (inside `<style>`):
```css
/* Banner */
.banner {
    position: sticky; top: 0; z-index: 100;
    background: var(--nav-bg);
    border-bottom: 1px solid var(--nav-border);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 16px; height: 52px;
}
.banner-logo { display: flex; align-items: center; gap: 4px; text-decoration: none; }
.banner-logo img { width: 28px; height: 28px; border-radius: 6px; }
.banner-title {
    font-family: var(--font-display);
    font-size: clamp(1.1rem, 3vw, 1.4rem);
    font-weight: 700;
    color: var(--text-main);
    letter-spacing: -0.01em;
}
.banner-title.gradient-text {
    background: linear-gradient(135deg, var(--brand-primary), var(--brand-accent));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.banner-actions { display: flex; align-items: center; gap: 8px; }
#theme-button {
    background: none; border: none; cursor: pointer;
    font-size: 1.2rem; padding: 6px; border-radius: 8px;
    transition: background 0.15s; line-height: 1;
}
#theme-button:hover { background: var(--card-border); }
```

**Banner HTML** (first element inside `<body>`):
```html
<header class="banner">
    <div class="banner-logo">
        <a href="/" title="Home"><img src="/assets/favicon.png" alt="Home"></a>
        <button onclick="history.back()" title="Go back" aria-label="Go back"
            style="background:none;border:none;cursor:pointer;padding:4px;display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;margin-left:6px;color:inherit;border-radius:6px;opacity:0.65;"
            onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.65'">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </button>
    </div>
    <div class="banner-title">App Name</div>
    <div class="banner-actions">
        <div class="theme-toggle">
            <button id="theme-button" aria-label="Toggle Light/Dark Theme" title="Toggle between light and dark themes">☀️</button>
        </div>
    </div>
</header>
```

**Theme JS** (inside `<script>` near end of body, replace `<APP-SLUG>` with a unique key e.g. `elevator-physics`):
```javascript
const themeButton = document.getElementById('theme-button');
const DARK_KEY = '<APP-SLUG>-dark';
const LIGHT_KEY = '<APP-SLUG>-light';

function updateAppChromeTheme(theme) {
    const tc = document.querySelector('meta[name="theme-color"]');
    const sb = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    const dark = theme === 'dark';
    if (tc) tc.setAttribute('content', dark ? '#111118' : '#F4F4F8');
    if (sb) sb.setAttribute('content', dark ? 'black-translucent' : 'default');
}
function updateButtonEmoji(theme) {
    themeButton.textContent = theme === 'dark' ? '\u{1F319}' : '\u{2600}\uFE0F';
}
const initTheme = localStorage.getItem(DARK_KEY) ? 'dark' : 'light';
document.documentElement.setAttribute('data-theme', initTheme);
updateAppChromeTheme(initTheme);
updateButtonEmoji(initTheme);
window.addEventListener('pageshow', function () {
    updateAppChromeTheme(document.documentElement.getAttribute('data-theme'));
});
themeButton.addEventListener('click', function () {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    if (next === 'dark') {
        localStorage.setItem(DARK_KEY, 'true');
        localStorage.removeItem(LIGHT_KEY);
    } else {
        localStorage.setItem(LIGHT_KEY, 'true');
        localStorage.removeItem(DARK_KEY);
    }
    updateAppChromeTheme(next);
    updateButtonEmoji(next);
});
```

**Brave iOS gradient-text fix** (last `<script>` before `</body>`):
```html
<!-- Brave iOS gradient text fix -->
<script>
(function () {
    if (/iP(hone|ad|od)/.test(navigator.userAgent) && navigator.brave) return;
    document.querySelectorAll('.banner-title').forEach(function (el) { el.classList.add('gradient-text'); });
})();
</script>
```

Key rules:
- The app title lives **only** in `<div class="banner-title">` — never add a separate `<h1>` for the app name
- `<link rel="icon" type="image/png" href="/assets/favicon.png">` is required on every page for the browser-tab favicon
- Use a **per-app** localStorage key (`<APP-SLUG>-dark`) so theme state doesn't bleed between apps
- The gradient is applied by JS (not CSS class in HTML) to avoid the Brave iOS rendering bug

### Card Pills (tab-page cards only)

Cards on the tab pages (appcm.html, tools.html, teachers.html, etc.) support two pills positioned at the top of each card:

**Type pill** (top-left) — matches `section-label` style: brand-primary border and text, monospace, uppercase:
```css
.card-type-pill {
    display: inline-flex; align-items: center;
    position: absolute; top: 0.65rem; left: 1rem; z-index: 2;
    padding: 0.22rem 0.5rem;
    border-radius: 4px;
    border: 1px solid var(--brand-primary);
    color: var(--brand-primary);
    font-family: var(--font-mono); font-size: 9px; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap;
    opacity: 0.7;
    transition: color 0.4s ease, border-color 0.4s ease;
}
```
Usage: `<span class="card-type-pill">Game</span>` (or "Sim", "Tool", etc.)

**Offline pill** (top-right) — added dynamically by JS via `initOfflineCardPills()` when the card path appears in `OFFLINE_CARD_REQUIREMENTS`. Do not add this manually in HTML.

## Offline Behavior

- **Guaranteed offline after install**: Pages/assets explicitly listed in `sw.js` `ASSETS_TO_CACHE`
- **May work offline after first online visit**: Other same-origin GET resources (runtime cache), except `/beta/*`
- **Requires network**: `/beta/*`, `fun/dodge.html`, `fun/dodge_assets/*`, and any `*.supabase.co` API calls

## External Services

### Supabase
Used for leaderboards in the dodge game. API calls go to `*.supabase.co` and are excluded from caching.

## Notes for AI Assistants

1. **No build step**: Edit files directly, no npm/webpack/etc.
2. **Self-contained pages**: Each HTML file is a complete application
3. **Always bump `BUILD_ID` in `sw.js` after code changes**: Any time you modify a file that is listed in `ASSETS_TO_CACHE`, bump the `BUILD_ID` timestamp as your **final step** before finishing. This is easy to forget — do not skip it
4. **CDN URL exactness**: Keep CDN script/style URLs in HTML exactly aligned with `ASSETS_TO_CACHE`
5. **Theme awareness**: Always use CSS variables, not hardcoded colors
6. **Mobile-first**: Consider touch interactions and responsive design
7. **Offline-first**: Ensure new features work without network
8. **CDN dependencies**: External libraries are loaded from CDNs, not bundled
9. **Keep it simple**: Avoid adding frameworks or build complexity
10. **No absolute paths in output**: For security, never show the full absolute file path when summarizing code changes. Use repo-relative paths instead.
