import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { defaultPortfolioData } from './data/defaultData';
import { PortfolioData } from './types';
import { NavigationControl } from './components/NavigationControl';
import { SlideHeader } from './components/SlideHeader';
import { SlideAbout } from './components/SlideAbout';
import { SkillsSection } from './components/SkillsSection';
import { SlideEducation } from './components/SlideEducation';
import { SiteFooter } from './components/SiteFooter';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [data] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem('portfolio_data_cache_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clear out old Mariana cached data if present
        if (parsed.name && (parsed.name.includes('MARIANA') || parsed.name.includes('Mariana'))) {
          localStorage.removeItem('portfolio_data_cache_v2');
          return defaultPortfolioData;
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return defaultPortfolioData;
  });

  // Lenis Smooth Scroll Integration synchronized with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.6,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Global smooth anchor navigation
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement, {
            offset: href === '#cover' ? 0 : -30,
            duration: 1.4,
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black">
      {/* Top Header Navigation */}
      <NavigationControl />

      {/* 
        Continuous Editorial Flow:
        1. Cover (Scroll Trigger Animation Section with full viewport height & UI elements on top)
        2. SlideAbout
        3. SkillsSection
        4. SlideEducation
        5. SiteFooter
      */}
      <main className="flex-1 w-full flex flex-col">
        {/* Cover Section: Full-width viewport scroll-trigger sequence with UI elements above */}
        <SlideHeader data={data} />

        {/* Remaining Sections: Clean editorial columns */}
        <div className="w-full max-w-7xl mx-auto flex flex-col">
          <SlideAbout data={data} />
          <SkillsSection data={data} />
          <SlideEducation data={data} />
          <SiteFooter data={data} />
        </div>
      </main>
    </div>
  );
}
