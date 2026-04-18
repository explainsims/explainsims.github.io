# ExplAIn Sims Project Context

## Project Overview
ExplAIn Sims is a collection of browser-based physics tools, simulations, and educational mini-apps. It is designed to be accessible (no installation) and interactive. The project prioritizes simplicity and resilience for classroom environments where devices may be locked down.

### Core Technologies
- **Frontend:** HTML5, CSS3 (Vanilla), Vanilla JavaScript.
- **Architecture:** Static site hosted on GitHub Pages. No framework, no bundler, no build step.
- **Key Libraries:**
  - **Visualization:** Plotly.js, Three.js, Chart.js.
  - **Math/Physics:** Math.js, MathJax (LaTeX rendering), MediaPipe (Hand Landmarker for interactive sims).
  - **Content:** Marked (Markdown), DOMPurify (Security), highlight.js.
- **Backend (Optional):** Supabase for specific features like leaderboards.

## Project Structure
- `/index.html`: Main landing page and portal.
- `/tools/`: Productivity apps.
- `/appcm/`: AP Physics C Mechanics simulations.
- `/teachers/`: Utility apps for educators.
- `/assets/`: Shared assets and icons.

## Development Guidelines & Conventions

### 1. Self-Contained Pages
Each HTML entry point should be as independent as possible. Shared logic should be placed in subdirectories or `assets/`.

### 2. UI/UX Principles
- **Classroom Ready:** Interfaces must be mobile-friendly and touch-friendly.
- **Three.js Canvas Resize:** Always call `renderer.setSize(w, h, false)` (the `false` prevents inline CSS that causes resize loops on mobile). Set `height: 0` on the canvas CSS alongside `flex: 1; min-height: 0` so flexbox controls sizing.
- **Theme Support:** Follow the existing light/dark theme pattern using CSS variables and `data-theme` attributes on `<html>`.
- **Low Friction:** Avoid mandatory logins or complex setup steps.

### 3. Code Quality
- **Vanilla JS:** Prefer clean, readable Vanilla JavaScript over adding new external dependencies.
- **Error Handling:** Ensure robust error handling, especially for hardware-dependent features like camera or microphone access.
- **Performance:** Optimize for low-end school devices. Avoid heavy computations on the main thread where possible (use Web Workers for tasks like curve fitting).
- **PanPhyPlot Fitting Modules:** Keep shared fit math logic in `panphy/panphyplot/js/fit-core.js`; `curve-fitting.js` and `fit-worker.js` should consume that shared module rather than duplicating numerical helpers.

## Common Tasks

### Adding a New App
1. For a published page: create the HTML/JS/CSS in the appropriate directory (`appcm/`, `panphy/`, `teachers/`, etc.).
2. Add the shared footer just before `</body>`: `<div id="site-footer"></div>` + `<script src="/assets/footer.js"></script>`. Never write an inline `<footer>` element or page-specific `footer { }` CSS.
3. Add the new entry point to the grid in the relevant gallery page.
4. Add the page URL to `sitemap.xml`.

### Running the Project
Since there is no build step, you can serve the project using any local HTTP server:
- `python3 -m http.server 8000`
- `npx serve .`
- Or simply open `index.html` in a browser (though some features may require a local server).

## Interaction Context
When assisting with this project:
- Prioritize Vanilla JS solutions.
- New pages not yet ready to publish should be kept off the navigation (no link from a gallery page) until explicitly promoted to production.
- For security, never show the full absolute file path when summarizing code changes. Use repo-relative paths instead.
