# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Velhos Sabores** is a static website for an artisan bakery ("Padaria Artesanal") built with React 18 and vanilla CSS. It's a browser-based single-page application (SPA) with no build tools — React and Babel are loaded via CDN and Babel transpiles JSX in the browser at runtime.

## Architecture

### Tech Stack
- **React 18** (loaded from unpkg CDN)
- **Babel Standalone** for JSX transpilation
- **Vanilla JavaScript & CSS** (no build tools, no bundler)
- **GitHub Pages** for hosting (automatic deployment on push to main)

### Code Structure
- `index.html` — Entry point; loads React, Babel, and all JSX files in order
- `app.jsx` — Main routing, palette tweaks, secret route (`#studio`) handling
- `components.jsx` — Shared UI components: Nav, Footer, Brand, Icons, WhatsApp button, reveal-on-scroll hook
- `data.jsx` — Product catalog (4 breads) and comparison table (artesanal vs industrial)
- `home.jsx`, `produtos.jsx`, `sobre.jsx` — Page components
- `tweaks-panel.jsx` — Reusable design tweaks interface (color palettes, grain texture)
- `instagram-generator.html` — Separate HTML file embedded as iframe in studio mode; has its own standalone React instance
- `styles.css`, `ui.css` — Global styles
- `assets/` — Logo and images

### Data Flow
1. App initializes with tweaks from localStorage (defaults in `TWEAK_DEFAULTS` in app.jsx)
2. Tweaks applied to `<html data-palette="...">` and CSS variables
3. Navigation is hash-based; `window.location.hash === '#studio'` activates the studio iframe
4. Product images use Unsplash URLs; logo and one sample image are in assets/

## Development

### Running Locally
No build step needed. Open the repo in a browser:
```bash
# Option 1: Use Python's built-in server
python3 -m http.server 8000
# Then visit http://localhost:8000

# Option 2: Use Node's http-server (if installed)
npx http-server

# Option 3: Use VS Code's Live Server extension
```

### File Order Matters
The `<script>` tags in `index.html` have a load order. Don't reorder them; each file exports to `window` and may depend on earlier files:
1. tweaks-panel.jsx (defines `useTweaks` hook and UI controls)
2. data.jsx (product catalog, comparison data)
3. components.jsx (shared components)
4. home.jsx, produtos.jsx, sobre.jsx (pages)
5. app.jsx (main app, must be last to mount React)

### Making Changes
- **Add a page**: Create `newpage.jsx`, add `<script>` in `index.html`, define a Page component, add route in `app.jsx`
- **Add a product**: Edit `VS_PRODUCTS` array in `data.jsx`
- **Change colors**: Edit `PALETTES` in `app.jsx`, or use tweaks panel in browser
- **Change text**: Edit corresponding `.jsx` file (hardcoded in JSX, not in a config file)
- **Add assets**: Drop in `assets/`, reference in JSX (e.g., `src="assets/filename"`)

### Tweaks System
The tweaks panel (bottom-right corner) allows runtime customization:
- **Paletas de cores**: 4 curated color palettes (Forno, Geleia, Horta, Manhã)
- **Textura**: Grain paper texture toggle

Tweaks are stored in localStorage under key `velhos-sabores-tweaks` and survive page reloads. The `TWEAK_DEFAULTS` block (lines 13–16 in app.jsx) is wrapped in `/*EDITMODE-BEGIN*/.../*EDITMODE-END*/` markers — this signals external tools (Figma plugins, studio tools) where defaults can be modified.

### Studio Route
Navigate to `#studio` (or use a link with `href="#studio"`) to embed `instagram-generator.html` as a fullscreen iframe. This tool is separate and has its own React instance for designing Instagram post templates.

## Deployment

The repo is automatically deployed to GitHub Pages on every push to `main` via `.github/workflows/static.yml`. The workflow:
1. Checks out the code
2. Uploads the entire repo root as the artifact
3. Deploys to GitHub Pages

No build step or processing happens — the site is served as-is from the repo root.

## Performance & UX Details

### Reveal-on-Scroll
The `useReveal()` hook in `components.jsx` animates elements with `.reveal` class on scroll:
- Uses IntersectionObserver (with a fallback) to detect when elements enter viewport
- Applies `.in` class to trigger CSS animations
- Has a 1.4s safety timeout to ensure content never stays hidden

### WhatsApp Integration
- WhatsApp number: `5548984971362`
- All CTA buttons use `waLink(msg)` function to generate WhatsApp deep links
- FloatingActionButton appears after 700ms with a tooltip at 2.2s

## Localization & Language
The site is entirely in Portuguese (Brazil). All UI text is hardcoded in JSX.

## Conventions

- Use semantic HTML and accessible component patterns
- Keep components functional; use React hooks
- Prefix custom classes with `vs-` (Velhos Sabores) to avoid collisions
- Store product images on Unsplash for easy updates; keep only logo and one sample in assets/
- Use CSS custom properties for palette colors (set by the tweaks system on `<html>`)

## Studio Tools

The app has two iframe-embedded studio tools accessible via URL hash:

### Instagram Post Generator (`#studio`)
Located in `instagram-generator.html`. Creates social media post templates with customizable layouts and color palettes.

### Recipe eBook Generator (`#recipe-studio`)
Located in `recipe-ebook-generator.html`. Creates downloadable PDF eBooks with recipe information:
- Form fields: title, tagline, description, ingredients, preparation steps, tips
- 4 color palettes matching the site's identity (Forno, Geleia, Horta, Manhã)
- Real-time PDF preview with professional typography (Merriweather serif)
- Download button generates A4 PDF with branded footer
- Uses `html2pdf.js` library for PDF generation

**To add a new studio tool:**
1. Create a new HTML file (e.g., `new-tool.html`)
2. Add route to `STUDIO_ROUTES` object in `app.jsx`
3. Add link to footer in `components.jsx` (under "Ferramentas" section)
4. Route will be accessible via `#route-name`

## References

- **WhatsApp API**: Deep links use `https://wa.me/{number}?text={message}`
- **GitHub Pages**: Docs at https://pages.github.com
- **React 18 (CDN)**: https://react.dev/reference/react (use CDN docs for development)
- **Babel Standalone**: https://babeljs.io/docs/en/babel-standalone
- **html2pdf.js**: https://ekoopmans.github.io/html2pdf.js/ (for PDF generation)
