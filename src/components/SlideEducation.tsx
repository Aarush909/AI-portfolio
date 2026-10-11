import React from 'react';
import { TopBar } from './TopBar';
import { PortfolioData } from '../types';

interface SlideEducationProps {
  data: PortfolioData;
}

export const SlideEducation: React.FC<SlideEducationProps> = ({ data }) => {
  return (
    <section
      id="education"
      className="relative w-full bg-black text-white flex flex-col justify-between px-6 sm:px-10 md:px-14 lg:px-16 pt-8 pb-16 sm:pb-24 border-b border-neutral-900"
    >
      {/* Top Bar Line (Date removed) */}
      <TopBar category={data.category} />

      {/* Main Content Area */}
      <div className="py-16 sm:py-24 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column / Context */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-6">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-medium block">
              04 // Academic Timeline
            </span>
          </div>
        </div>

        {/* Right Column: Exact Typography from Design */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-12">
          <div>
            <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-condensed uppercase tracking-tight text-white leading-[0.88] flex flex-col">
              <span className="text-white block">MY</span>
              <span className="text-white block">EDUCATION</span>
            </h2>
          </div>

          {/* Education Entries List */}
          <div className="space-y-10 max-w-2xl">
            {data.education.map((item) => (
              <div key={item.id} className="space-y-2 group">
                <div className="flex items-baseline justify-between text-base sm:text-lg border-b border-neutral-900 pb-2">
                  <h3 className="font-semibold text-white tracking-wide text-base sm:text-lg">
                    {item.institution}
                  </h3>
                  {item.period ? (
                    <span className="text-xs sm:text-sm text-neutral-400 font-mono tracking-wider tabular-nums">
                      {item.period}
                    </span>
                  ) : null}
                </div>
                <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed pt-1">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle section transition hint */}
      <div className="flex items-center justify-between text-neutral-600 text-xs font-mono tracking-widest pt-8 border-t border-neutral-950">
        <span>SCHOLASTIC RECORD</span>
        <span>INDEX 04 / 04</span>
      </div>
    </section>
  );
};
