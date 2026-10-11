# Aarush — Interactive Scroll-Trigger Portfolio

High-performance scroll-driven canvas sequence animation with **GSAP ScrollTrigger** and **Lenis Smooth Scroll**.

---

## ✨ Features

- **97-Frame Smooth Scrub Engine**: Renders extracted frames from `ezgif-418a7793578c8a02-jpg.zip` with GPU-accelerated HTML5 `<canvas>`.
- **Bidirectional Scroll Scrubbing**:
  - **Scroll Down**: Plays frame sequence forward (`01` &rarr; `97`).
  - **Scroll Up**: Plays frame sequence backward (`97` &rarr; `01`).
- **Lenis Smooth Scroll**: Butter-smooth inertial scrolling synchronized directly into the GSAP ticker loop.
- **Hero Cover Logic & High-DPI (Retina)**:
  - Supports both `Cover` (full viewport bleed with calibrated focal alignment) and `Cinematic Stage` (full-frame with ambient edge aura).
  - High-DPI canvas buffer with `devicePixelRatio` scaling (capped at 2x for optimal 60-120fps performance).
- **Synchronized Narrative Overlays**:
  - `0% - 28%`: Intro hero headline
  - `35% - 65%`: Greeting & wave card (synchronized with Aarush waving hello)
  - `72% - 100%`: Confidence card (synchronized with arms crossed pose)
- **Preloader with Zero-Flicker Fallback**:
  - Instant loading and rendering of Frame 1 so the page is never blank.
  - Concurrent background preloading of remaining frames with glowing percentage counter.
  - Fallback to nearest loaded frame prevents any flash or white frame if scrolled early.
- **Future-Ready Architecture**:
  - Prepared with semantic container `#site-header` and global APIs `window.lenis` and `window.portfolioHero` for your upcoming custom Header UI.

---

## 🚀 Quick Start

To launch the portfolio locally:

```bash
# Using Node (zero dependencies required)
npm start
# or
node server.js
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

Alternatively, you can open `index.html` with VS Code Live Server or Vite.

---

## 📁 File Structure

```
portfolio/
├── frames/                       # 97 extracted high-resolution frames (001 to 097)
├── vendor/                       # Offline-ready libraries
│   ├── gsap.min.js               # GSAP 3.12.5 core
│   ├── ScrollTrigger.min.js      # ScrollTrigger 3.12.5 plugin
│   └── lenis.min.js              # Lenis 1.1.18 smooth scroll
├── index.html                    # Semantic HTML5 layout & narrative steps
├── style.css                     # Noir luxe studio aesthetic & responsive styles
├── main.js                       # Canvas render engine, Lenis, and GSAP timeline
├── server.js                     # Zero-dependency local dev server
└── package.json                  # Scripts & metadata
```

---

## 🛠️ Future Header UI Integration Notes

When you are ready to provide your custom Header UI:
1. Locate `<header id="site-header">` in [`index.html`](file:///c:/Users/AARUSH/Desktop/portfolio/index.html).
2. Insert your custom markup inside `.header-container`.
3. Add `data-lenis-scroll` to any anchor link (`<a href="#section" data-lenis-scroll>`) to enable automated Lenis smooth scrolling to that anchor.
4. You can control the canvas framing or access scroll state anywhere using:
   - `window.lenis.scrollTo(target, options)`
   - `window.portfolioHero.setFitMode('cover')` or `'cinematic'`
   - `window.portfolioHero.getCurrentFrame()`
