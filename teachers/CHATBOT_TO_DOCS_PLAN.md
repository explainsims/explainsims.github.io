# Chatbot-to-Docs Converter - Implementation Plan

## Overview
A tool that converts AI chatbot output into a format ready to paste into Google Docs.
Location: `teachers/chatbot_to_docs.html`

## Research Findings

### LaTeX Rendering
- **CodeCogs API** (used by AutoLaTeX add-on): `https://latex.codecogs.com/svg.image?\dpi{200}{EQUATION}`
  - Formats: `png.image`, `svg.image`, `gif.image`
  - DPI control: `\dpi{150}`, `\dpi{200}`, `\dpi{300}`
  - Color: `\color[RGB]{R,G,B}` or `\color{black}`
  - AutoLaTeX fallback chain: CodeCogs → EasyGenerator staging → TexRendr → SciWeavers
- **For preview**: Use MathJax 3.x (already used in codebase) for beautiful in-browser rendering
- **For clipboard/paste**: Use `<img>` tags with CodeCogs URLs so Google Docs fetches and embeds them
- **LaTeX delimiters** to detect (from chatbots):
  - `$$...$$` (display math - ChatGPT, Claude, Gemini)
  - `$...$` (inline math - all chatbots)
  - `\[...\]` (display math - some chatbots)
  - `\(...\)` (inline math - some chatbots)

### Citation Patterns to Strip
| Pattern | Source | Regex |
|---------|--------|-------|
| `【1†source】` | ChatGPT web search | `【[^】]*】` |
| `[cite:...]` | Generic | `\[cite:[^\]]*\]` |
| `[1]`, `[2]` superscript refs | Perplexity, Copilot | `\[(\d+)\]` (with option - may be intentional) |
| `[1, 2, 3]` grouped refs | Perplexity | `\[\d+(?:,\s*\d+)*\]` |
| `(Source: ...)` | Gemini | `\(Source:[^)]*\)` |
| Trailing reference sections | Multiple | Lines starting with "Sources:", "References:", "Citations:" followed by URL lists |
| `^1`, `^2` footnote markers | Various | `\^\d+` |
| `[citation needed]` | Rare | `\[citation needed\]` |

### UI Layout
Two-panel layout:
- **Left/Top**: Input textarea + options panel
- **Right/Bottom**: Rendered preview + copy buttons

### Options Panel
1. **Citation Removal** (checkbox group):
   - ChatGPT citations `【...】`
   - Bracket references `[1]`, `[2]`
   - Source/reference sections at end
   - Claude `[cite:...]`
   - Custom regex field
2. **LaTeX Handling**:
   - Toggle: Convert LaTeX to images (on/off)
   - Image size: small/medium/large (maps to DPI)
3. **Font Controls**:
   - Font family dropdown (common Google Docs fonts: Arial, Times New Roman, Georgia, Calibri, etc.)
   - Body font size slider (10-24pt)
   - Header scaling toggle: "Scale headers proportionally" vs "Keep headers fixed"
4. **Output Format**:
   - "Rich Text" mode (HTML with images - for normal paste)
   - "Markdown" mode (clean markdown with image links - for Paste as Markdown)

### Copy Mechanism
- Use `navigator.clipboard.write()` with `ClipboardItem` containing `text/html` and `text/plain`
- Rich HTML copy includes `<img>` tags with CodeCogs URLs
- Markdown copy outputs clean markdown with `![equation](codecogs_url)` for LaTeX

### External Libraries (CDN)
- `marked.js` (4.3.0) - already in codebase CDN list
- `DOMPurify` (2.3.4) - already in codebase CDN list
- `MathJax` 3.x - for live preview rendering
- `highlight.js` (11.8.0) - for code block highlighting in preview

### Template
Follow standard ExplAIn Sims patterns:
- Banner with home link, back button, theme toggle
- CSS variables for light/dark theme
- Shared footer via `/assets/footer.js`
- Per-app localStorage key: `chatbot-docs-dark`
- NOT published initially (no sw-register.js, no index.html link, no sitemap)
