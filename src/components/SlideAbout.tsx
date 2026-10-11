import React from 'react';
import { TopBar } from './TopBar';
import { PortfolioData } from '../types';

interface SlideAboutProps {
  data: PortfolioData;
}

export const SlideAbout: React.FC<SlideAboutProps> = ({ data }) => {
  return (
    <section
      id="about"
      className="relative w-full bg-black text-white flex flex-col justify-between px-6 sm:px-10 md:px-14 lg:px-16 pt-8 pb-16 sm:pb-24 border-b border-neutral-900"
    >
      {/* Top Bar Line (Date removed) */}
      <TopBar category={data.category} />

      {/* Main Content: Exact condensed headline and bio prose on plain black background */}
      <div className="py-16 sm:py-24 md:py-28 max-w-4xl">
        <div className="space-y-8">
          <div>
            <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-condensed uppercase tracking-tight text-white leading-[0.88] flex flex-col">
              <span className="text-white block">{data.greeting}</span>
              <span className="text-white block">{data.firstName}</span>
              <span className="text-white block">{data.lastName}</span>
            </h2>
          </div>

          <div className="max-w-2xl pt-2">
            <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
              {data.bioDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Subtle section transition hint */}
      <div className="flex items-center justify-between text-neutral-600 text-xs font-mono tracking-widest pt-8 border-t border-neutral-950">
        <span>BIOGRAPHY & BACKGROUND</span>
        <span>INDEX 02 / 04</span>
      </div>
    </section>
  );
};
