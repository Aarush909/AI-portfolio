import React, { useEffect, useRef, useCallback } from 'react';
import { TopBar } from './TopBar';
import { PortfolioData } from '../types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 97;
const FRAME_PREFIX = '/frames/ezgif-frame-';
const FRAME_EXT = '.jpg';

interface SlideHeaderProps {
  data: PortfolioData;
}

export const SlideHeader: React.FC<SlideHeaderProps> = ({ data }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentFrameRef = useRef<number>(0);

  // Helper to format frame path: /frames/ezgif-frame-001.jpg
  const getFramePath = useCallback((index: number) => {
    const frameStr = String(index + 1).padStart(3, '0');
    return `${FRAME_PREFIX}${frameStr}${FRAME_EXT}`;
  }, []);

  // Render a specific frame on the canvas
  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    currentFrameRef.current = index;

    // Find requested or nearest available loaded frame to prevent any blank frame
    let img: HTMLImageElement | null = imagesRef.current[index];
    if (!img) {
      for (let i = index - 1; i >= 0; i--) {
        if (imagesRef.current[i]) {
          img = imagesRef.current[i];
          break;
        }
      }
      if (!img) {
        for (let i = index + 1; i < TOTAL_FRAMES; i++) {
          if (imagesRef.current[i]) {
            img = imagesRef.current[i];
            break;
          }
        }
      }
    }

    if (!img) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.width;
    const ih = img.height;

    // Clear with dark pure background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, cw, ch);

    // Cover math: fit 100% height and width of the scroll trigger
    const scale = Math.max(cw / iw, ch / ih);
    const rw = iw * scale;
    const rh = ih * scale;
    const ox = (cw - rw) * 0.5;

    // On widescreen, align slightly towards upper portion (0.22) so face & hands are at eye-level
    const oy = cw / ch > iw / ih ? (ch - rh) * 0.22 : (ch - rh) * 0.5;

    ctx.drawImage(img, ox, oy, rw, rh);
  }, []);

  // Resize canvas with High-DPI support
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = section.getBoundingClientRect();

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    renderFrame(currentFrameRef.current);
  }, [renderFrame]);

  // Preload frames with immediate Frame 1 priority
  useEffect(() => {
    let isCancelled = false;

    // Priority 1: Load first frame immediately
    const firstImg = new Image();
    firstImg.src = getFramePath(0);
    firstImg.onload = () => {
      if (isCancelled) return;
      imagesRef.current[0] = firstImg;
      handleResize();
      renderFrame(0);

      // Priority 2: Preload remaining frames concurrently
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = getFramePath(i);
        img.onload = () => {
          if (isCancelled) return;
          imagesRef.current[i] = img;
        };
      }
    };

    return () => {
      isCancelled = true;
    };
  }, [getFramePath, handleResize, renderFrame]);

  // Setup GSAP ScrollTrigger timeline to scrub frames forward & backward
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    handleResize();
    window.addEventListener('resize', handleResize);

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=2400', // Scroll distance for smooth scrubbing
      pin: true,
      pinSpacing: true,
      scrub: 0.8, // Inertial forward & backward scrub
      anticipatePin: 1,
      onUpdate: (self) => {
        const frameIdx = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.round(self.progress * (TOTAL_FRAMES - 1)))
        );
        renderFrame(frameIdx);
      },
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      trigger.kill();
    };
  }, [handleResize, renderFrame]);

  return (
    <section
      ref={sectionRef}
      id="cover"
      className="relative w-full h-screen min-h-[700px] bg-black text-white flex flex-col justify-between overflow-hidden border-b border-neutral-900"
    >
      {/* 
        ========================================================================
        SCROLL TRIGGER ANIMATION CANVAS (Takes up 100% height of scroll trigger)
        ======================================================================== 
      */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Atmospheric Editorial Gradients:
          Ensures the left-hand text remains razor sharp and readable while
          preserving the full visual impact of the video scrub animation. */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] bg-gradient-to-r from-black/90 via-black/45 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none z-[1] bg-gradient-to-t from-black via-transparent to-black/40"
        aria-hidden="true"
      />

      {/* 
        ========================================================================
        UI ELEMENTS (PLACED ABOVE THE SCROLL TRIGGER ANIMATION)
        All UI elements from src preserved cleanly with brutalist typography.
        ======================================================================== 
      */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between px-6 sm:px-10 md:px-14 lg:px-16 pt-8 pb-12 pointer-events-auto">
        
        {/* Top Bar Line (Date removed) */}
        <div>
          <TopBar category={data.category} />
        </div>

        {/* Hero Opening Content */}
        <div className="py-8 sm:py-12 md:py-16 max-w-5xl my-auto">
          <div className="space-y-6 sm:space-y-8">
            <div className="inline-block">
              <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-medium bg-black/40 px-2 py-1 rounded backdrop-blur-sm border border-neutral-800/60">
                01 // Selected Works & Archive
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-condensed uppercase tracking-tight text-white leading-[0.88] drop-shadow-lg">
                {data.name}
              </h1>
              <p className="text-sm sm:text-base tracking-[0.2em] uppercase text-neutral-300 font-medium drop-shadow-sm">
                Editorial & Visual Design Direction
              </p>
            </div>

            <div className="pt-2 max-w-2xl">
              <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed drop-shadow-sm bg-black/30 p-3 rounded backdrop-blur-sm border border-neutral-900/60">
                {data.coverDescription}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
