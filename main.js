/**
 * ====================================================================
 * AARUSH PORTFOLIO - SCROLL TRIGGER FRAME ANIMATION & LENIS ENGINE
 * 
 * - High-DPI HTML5 Canvas Sequence Renderer (97 frames)
 * - Buttery Smooth Scroll via Lenis + GSAP ScrollTrigger Synchronization
 * - Bidirectional Scrubbing (Forward on scroll-down, Backward on scroll-up)
 * - Intelligent Cover / Cinematic Framing Algorithms
 * - Preloader with Instant First-Frame Priority & Zero-Flicker Fallback
 * - Future-proof modular architecture ready for custom Header UI injection
 * ====================================================================
 */

(() => {
  'use strict';

  // ------------------------------------------------------------------
  // CONFIGURATION
  // ------------------------------------------------------------------
  const CONFIG = {
    frameCount: 97,
    framePathPrefix: 'frames/ezgif-frame-',
    frameExtension: '.jpg',
    scrollDistance: 2800, // Pixels of scroll travel for the pinned sequence
    scrubSmoothness: 0.7, // Inertia scrub time in seconds (0.5 to 1.0 is silky smooth)
    initialFitMode: 'cover', // 'cover' or 'cinematic'
    focalY: 0.24, // Focus anchor (0 = top, 0.5 = center). 0.24 keeps face & sunglasses nicely framed on widescreen
  };

  // ------------------------------------------------------------------
  // STATE MANAGEMENT
  // ------------------------------------------------------------------
  const state = {
    images: new Array(CONFIG.frameCount),
    loadedCount: 0,
    isFirstFrameReady: false,
    allFramesReady: false,
    currentFrameIndex: 0,
    fitMode: CONFIG.initialFitMode,
    dpr: Math.min(window.devicePixelRatio || 1, 2), // High-DPI capped at 2 for performance
  };

  // ------------------------------------------------------------------
  // DOM REFERENCES
  // ------------------------------------------------------------------
  const DOM = {
    canvas: document.getElementById('hero-canvas'),
    ctx: null,
    preloader: document.getElementById('preloader'),
    preloaderFill: document.getElementById('preloader-fill'),
    preloaderPercent: document.getElementById('preloader-percent'),
    preloaderStatus: document.getElementById('preloader-status'),
    heroSection: document.getElementById('hero'),
    heroPinWrapper: document.getElementById('hero-pin-wrapper'),
    narrative1: document.getElementById('narrative-1'),
    narrative2: document.getElementById('narrative-2'),
    narrative3: document.getElementById('narrative-3'),
    hudFrameNum: document.getElementById('hud-frame-num'),
    trackerFill: document.getElementById('hero-tracker-fill'),
    toggleFitBtn: document.getElementById('toggle-fit-mode'),
    fitModeLabel: document.getElementById('fit-mode-label'),
  };

  if (DOM.canvas) {
    DOM.ctx = DOM.canvas.getContext('2d', { alpha: false });
  }

  // ------------------------------------------------------------------
  // 1. LENIS SMOOTH SCROLL INITIALIZATION
  // ------------------------------------------------------------------
  let lenisInstance = null;

  function initLenis() {
    if (typeof Lenis === 'undefined') {
      console.warn('Lenis is not loaded, falling back to native scroll.');
      return;
    }

    lenisInstance = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.6,
      infinite: false,
    });

    // Expose lenis globally for future Header UI and developer controls
    window.lenis = lenisInstance;

    // Connect Lenis scroll events to GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      lenisInstance.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Smooth anchor navigation
    setupSmoothAnchorLinks();
  }

  function setupSmoothAnchorLinks() {
    document.querySelectorAll('[data-lenis-scroll], a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          const targetEl = document.querySelector(targetId);
          if (targetEl && lenisInstance) {
            e.preventDefault();
            lenisInstance.scrollTo(targetEl, {
              offset: targetId === '#hero' ? 0 : -40,
              duration: 1.4,
            });
          }
        }
      });
    });
  }

  // ------------------------------------------------------------------
  // 2. IMAGE PRELOADER WITH FIRST-FRAME PRIORITY
  // ------------------------------------------------------------------
  function getFrameSrc(index) {
    // ezgif-frame-001.jpg ... ezgif-frame-097.jpg
    const frameNum = String(index + 1).padStart(3, '0');
    return `${CONFIG.framePathPrefix}${frameNum}${CONFIG.frameExtension}`;
  }

  function preloadFrames() {
    return new Promise((resolve) => {
      let resolved = false;

      // STEP A: Load Frame 0 (first frame) immediately to show content ASAP
      const firstImg = new Image();
      firstImg.src = getFrameSrc(0);
      firstImg.onload = () => {
        state.images[0] = firstImg;
        state.isFirstFrameReady = true;
        renderFrame(0);

        // Update initial progress
        updatePreloaderProgress(1);

        // STEP B: Preload all remaining frames concurrently
        loadRemainingFrames(() => {
          if (!resolved) {
            resolved = true;
            resolve();
          }
        });
      };

      firstImg.onerror = () => {
        console.error('Failed to load first frame:', firstImg.src);
        // Continue loading remaining frames even if first failed
        loadRemainingFrames(() => {
          if (!resolved) {
            resolved = true;
            resolve();
          }
        });
      };
    });
  }

  function loadRemainingFrames(onComplete) {
    let completed = 1; // first frame is already counted
    const total = CONFIG.frameCount;

    for (let i = 1; i < total; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);

      img.onload = () => {
        state.images[i] = img;
        completed++;
        state.loadedCount = completed;
        updatePreloaderProgress(completed);

        if (completed === total) {
          state.allFramesReady = true;
          if (onComplete) onComplete();
        }
      };

      img.onerror = () => {
        console.warn(`Frame ${i} failed to load, will use fallback during scrub.`);
        completed++;
        state.loadedCount = completed;
        updatePreloaderProgress(completed);

        if (completed === total) {
          state.allFramesReady = true;
          if (onComplete) onComplete();
        }
      };
    }
  }

  function updatePreloaderProgress(count) {
    const percent = Math.min(100, Math.round((count / CONFIG.frameCount) * 100));

    if (DOM.preloaderFill) {
      DOM.preloaderFill.style.width = `${percent}%`;
    }
    if (DOM.preloaderPercent) {
      DOM.preloaderPercent.textContent = `${percent}%`;
    }
    if (DOM.preloaderStatus) {
      DOM.preloaderStatus.textContent = `Preloading frames (${count}/${CONFIG.frameCount})...`;
    }
  }

  function dismissPreloader() {
    if (!DOM.preloader) return;

    if (typeof gsap !== 'undefined') {
      gsap.to(DOM.preloader, {
        opacity: 0,
        scale: 1.02,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          DOM.preloader.classList.add('loaded');
          animateInitialHeroEntry();
        },
      });
    } else {
      DOM.preloader.classList.add('loaded');
      animateInitialHeroEntry();
    }
  }

  function animateInitialHeroEntry() {
    // Subtle entrance animation for the initial narrative text
    if (typeof gsap !== 'undefined' && DOM.narrative1) {
      gsap.fromTo(
        DOM.narrative1,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }
      );
    } else if (DOM.narrative1) {
      DOM.narrative1.style.opacity = '1';
      DOM.narrative1.style.transform = 'translateY(0)';
    }
  }

  // ------------------------------------------------------------------
  // 3. CANVAS HIGH-DPI SIZING & RENDERING ENGINE
  // ------------------------------------------------------------------
  function resizeCanvas() {
    if (!DOM.canvas || !DOM.ctx) return;

    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    DOM.canvas.width = Math.floor(width * state.dpr);
    DOM.canvas.height = Math.floor(height * state.dpr);

    // CSS dimensions
    DOM.canvas.style.width = `${width}px`;
    DOM.canvas.style.height = `${height}px`;

    // High quality smoothing
    DOM.ctx.imageSmoothingEnabled = true;
    DOM.ctx.imageSmoothingQuality = 'high';

    // Redraw currently active frame
    renderFrame(state.currentFrameIndex);
  }

  /**
   * Finds the best available image for a target frame index.
   * If the requested frame is still loading, finds the closest loaded frame
   * to guarantee zero blank canvas or flicker.
   */
  function getBestAvailableImage(targetIndex) {
    if (state.images[targetIndex]) return state.images[targetIndex];

    // Search backwards for the nearest loaded frame
    for (let i = targetIndex - 1; i >= 0; i--) {
      if (state.images[i]) return state.images[i];
    }
    // Search forwards if needed
    for (let i = targetIndex + 1; i < CONFIG.frameCount; i++) {
      if (state.images[i]) return state.images[i];
    }
    return null;
  }

  /**
   * Renders the specified frame index onto the canvas
   * Supports both 'cover' mode and 'cinematic' mode.
   */
  function renderFrame(index) {
    if (!DOM.ctx || !DOM.canvas) return;

    state.currentFrameIndex = index;
    const img = getBestAvailableImage(index);
    if (!img) return;

    const cw = DOM.canvas.width;
    const ch = DOM.canvas.height;
    const imgW = img.width;
    const imgH = img.height;

    // Clear canvas with base dark burgundy color (#0c0205)
    DOM.ctx.fillStyle = '#0c0205';
    DOM.ctx.fillRect(0, 0, cw, ch);

    if (state.fitMode === 'cover') {
      // --------------------------------------------------------------
      // COVER MODE: Fills entire hero section edge-to-edge
      // Uses calibrated focalY so face and wave are always framed beautifully
      // --------------------------------------------------------------
      const scale = Math.max(cw / imgW, ch / imgH);
      const renderW = imgW * scale;
      const renderH = imgH * scale;

      // Center horizontally
      const offsetX = (cw - renderW) * 0.5;

      // On widescreen (where canvas is wider than portrait frame),
      // anchor at focalY (0.24) so Aarush's face is naturally positioned
      let offsetY;
      if (cw / ch > imgW / imgH) {
        offsetY = (ch - renderH) * CONFIG.focalY;
      } else {
        // On portrait/mobile screens, center vertically
        offsetY = (ch - renderH) * 0.5;
      }

      DOM.ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

    } else {
      // --------------------------------------------------------------
      // CINEMATIC STAGE MODE:
      // Shows the full video frame uncropped, with real-time ambient
      // edge blur extending to fill the full widescreen canvas
      // --------------------------------------------------------------
      // Step 1: Draw blurred ambient backdrop to fill widescreen
      DOM.ctx.save();
      DOM.ctx.filter = 'blur(40px) brightness(0.6)';
      const bgScale = Math.max(cw / imgW, ch / imgH) * 1.05;
      const bgW = imgW * bgScale;
      const bgH = imgH * bgScale;
      DOM.ctx.drawImage(img, (cw - bgW) * 0.5, (ch - bgH) * 0.5, bgW, bgH);
      DOM.ctx.restore();

      // Step 2: Draw crisp subject frame centered
      const fitScale = Math.min(cw / imgW, ch / imgH);
      const renderW = imgW * fitScale;
      const renderH = imgH * fitScale;
      const offsetX = (cw - renderW) * 0.5;
      const offsetY = (ch - renderH) * 0.5;

      DOM.ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    }
  }

  // ------------------------------------------------------------------
  // 4. GSAP SCROLLTRIGGER FRAME SCRUBBING ENGINE
  // ------------------------------------------------------------------
  function initScrollAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.error('GSAP or ScrollTrigger not found.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Frame interpolation object
    const frameTracker = { frame: 0 };
    const maxFrame = CONFIG.frameCount - 1;

    // Master Timeline pinned to the Hero section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: DOM.heroSection,
        start: 'top top',
        end: `+=${CONFIG.scrollDistance}`,
        scrub: CONFIG.scrubSmoothness, // Inertial forward & backward scrub
        pin: DOM.heroPinWrapper,
        anticipatePin: 1,
        onUpdate: (self) => {
          updateHudAndProgress(self.progress, Math.round(frameTracker.frame));
          updateNarrativeSteps(self.progress);
        },
      },
    });

    // Scrub the frame index smoothly across the scroll distance
    tl.to(frameTracker, {
      frame: maxFrame,
      ease: 'none',
      onUpdate: () => {
        const frameIdx = Math.round(frameTracker.frame);
        renderFrame(frameIdx);
      },
    });

    // Refresh ScrollTrigger to ensure accurate layout calculations
    ScrollTrigger.refresh();
  }

  // ------------------------------------------------------------------
  // 5. NARRATIVE TEXT STEP TRANSITIONS
  // ------------------------------------------------------------------
  /**
   * Updates opacity and subtle translation of narrative cards
   * based on exact scroll progress:
   * - 0.00 to 0.28: Card 1 (Intro)
   * - 0.35 to 0.65: Card 2 (Wave gesture - frames 35-65)
   * - 0.72 to 1.00: Card 3 (Confidence/Crossed arms - frames 70-97)
   */
  function updateNarrativeSteps(progress) {
    // Step 1: Intro (0% to 28%)
    let op1 = 0;
    let y1 = 0;
    if (progress <= 0.22) {
      op1 = 1;
      y1 = 0;
    } else if (progress <= 0.30) {
      // Fade out
      const factor = (progress - 0.22) / 0.08;
      op1 = 1 - factor;
      y1 = -20 * factor;
    } else {
      op1 = 0;
      y1 = -20;
    }
    applyCardStyle(DOM.narrative1, op1, y1);

    // Step 2: Wave Hello (35% to 65%)
    let op2 = 0;
    let y2 = 20;
    if (progress >= 0.32 && progress < 0.38) {
      // Fade in
      const factor = (progress - 0.32) / 0.06;
      op2 = factor;
      y2 = 20 * (1 - factor);
    } else if (progress >= 0.38 && progress <= 0.60) {
      op2 = 1;
      y2 = 0;
    } else if (progress > 0.60 && progress <= 0.68) {
      // Fade out
      const factor = (progress - 0.60) / 0.08;
      op2 = 1 - factor;
      y2 = -20 * factor;
    } else {
      op2 = 0;
      y2 = progress < 0.32 ? 20 : -20;
    }
    applyCardStyle(DOM.narrative2, op2, y2);

    // Step 3: Crossed Arms / Call to Action (72% to 100%)
    let op3 = 0;
    let y3 = 20;
    if (progress >= 0.70 && progress < 0.78) {
      // Fade in
      const factor = (progress - 0.70) / 0.08;
      op3 = factor;
      y3 = 20 * (1 - factor);
    } else if (progress >= 0.78) {
      op3 = 1;
      y3 = 0;
    } else {
      op3 = 0;
      y3 = 20;
    }
    applyCardStyle(DOM.narrative3, op3, y3);
  }

  function applyCardStyle(el, opacity, translateY) {
    if (!el) return;
    el.style.opacity = opacity.toFixed(3);
    el.style.transform = `translateY(${translateY.toFixed(1)}px)`;
    el.style.pointerEvents = opacity > 0.3 ? 'auto' : 'none';
  }

  // ------------------------------------------------------------------
  // 6. HUD & PROGRESS TRACKER UPDATES
  // ------------------------------------------------------------------
  function updateHudAndProgress(progress, frameIndex) {
    // Update frame counter HUD (e.g. "01 / 97")
    if (DOM.hudFrameNum) {
      const current = String(frameIndex + 1).padStart(2, '0');
      DOM.hudFrameNum.textContent = `${current} / ${CONFIG.frameCount}`;
    }

    // Update bottom tracker progress bar
    if (DOM.trackerFill) {
      DOM.trackerFill.style.width = `${(progress * 100).toFixed(1)}%`;
    }
  }

  // ------------------------------------------------------------------
  // 7. FRAMING MODE TOGGLE (Cover vs Cinematic)
  // ------------------------------------------------------------------
  function setupFitModeToggle() {
    if (!DOM.toggleFitBtn) return;

    DOM.toggleFitBtn.addEventListener('click', () => {
      state.fitMode = state.fitMode === 'cover' ? 'cinematic' : 'cover';

      if (DOM.fitModeLabel) {
        DOM.fitModeLabel.textContent = `Fit: ${state.fitMode === 'cover' ? 'Cover' : 'Cinematic'}`;
      }

      renderFrame(state.currentFrameIndex);
    });
  }

  // ------------------------------------------------------------------
  // 8. WINDOW RESIZE WITH DEBOUNCE
  // ------------------------------------------------------------------
  let resizeTimeout = null;
  function setupResizeListener() {
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }, 100);
    });
  }

  // ------------------------------------------------------------------
  // 9. PUBLIC API & HEADER INTEGRATION BRIDGE
  // ------------------------------------------------------------------
  /**
   * Global API accessible via `window.portfolioHero`
   * Gives your future Header UI direct access to Lenis and canvas scrub!
   */
  window.portfolioHero = {
    setFitMode: (mode) => {
      if (mode === 'cover' || mode === 'cinematic') {
        state.fitMode = mode;
        if (DOM.fitModeLabel) DOM.fitModeLabel.textContent = `Fit: ${mode === 'cover' ? 'Cover' : 'Cinematic'}`;
        renderFrame(state.currentFrameIndex);
      }
    },
    getCurrentFrame: () => state.currentFrameIndex,
    getTotalFrames: () => CONFIG.frameCount,
    redraw: () => renderFrame(state.currentFrameIndex),
    getLenis: () => lenisInstance,
  };

  // ------------------------------------------------------------------
  // INITIALIZATION LIFECYCLE
  // ------------------------------------------------------------------
  async function init() {
    // 1. Setup Canvas dimensions
    resizeCanvas();
    setupResizeListener();
    setupFitModeToggle();

    // 2. Initialize Lenis Smooth Scroll
    initLenis();

    // 3. Preload frame sequence with Frame 1 priority
    await preloadFrames();

    // 4. Initialize GSAP ScrollTrigger timeline
    initScrollAnimation();

    // 5. Dismiss preloader and reveal hero
    dismissPreloader();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
