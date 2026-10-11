import React from 'react';
import { TopBar } from './TopBar';
import { PortfolioData } from '../types';

interface SkillsSectionProps {
  data: PortfolioData;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ data }) => {
  return (
    <section
      id="skills"
      className="relative w-full bg-black text-white flex flex-col justify-between px-6 sm:px-10 md:px-14 lg:px-16 pt-8 pb-16 sm:pb-24 border-b border-neutral-900"
    >
      {/* Top Bar Line (Date removed) */}
      <TopBar category={data.category} />

      {/* Main Content Area */}
      <div className="py-16 sm:py-24 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Bold Condensed Headline */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <div>
            <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-condensed uppercase tracking-tight text-white leading-[0.88] flex flex-col">
              <span className="text-white block">MY</span>
              <span className="text-white block">SKILLS</span>
            </h2>
          </div>

          <div className="pt-2 max-w-md">
            <span className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-medium block">
              03 // Capabilities & Tooling
            </span>
          </div>
        </div>

        {/* Right Column: Clean Editorial Skills Breakdown (Languages & Designing) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-14 pt-2">
            {data.skills.categories.map((cat) => (
              <div key={cat.id} className="space-y-4">
                <h3 className="text-sm font-semibold text-white tracking-widest uppercase pb-3 border-b border-neutral-800">
                  {cat.name}
                </h3>
                <ul className="space-y-2.5 text-sm sm:text-base text-neutral-300 font-light">
                  {cat.items.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="hover:text-white transition-colors flex items-center gap-3 py-1 border-b border-neutral-900/60"
                    >
                      <span className="text-neutral-600 text-xs">—</span>
                      <span className="tracking-wide">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle section transition hint */}
      <div className="flex items-center justify-between text-neutral-600 text-xs font-mono tracking-widest pt-8 border-t border-neutral-950">
        <span>CORE PROFICIENCIES & PRACTICES</span>
        <span>INDEX 03 / 04</span>
      </div>
    </section>
  );
};
