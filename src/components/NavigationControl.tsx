import React from 'react';

export const NavigationControl: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-black/90 backdrop-blur-md border-b border-neutral-900 px-6 sm:px-10 lg:px-16 py-4 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#cover"
          className="font-condensed text-xl sm:text-2xl tracking-wider uppercase text-white font-bold hover:text-neutral-300 transition-colors whitespace-nowrap shrink-0"
        >
          AARUSH GAIKWAD
        </a>

        {/* Zone 2: Clean Nav Links */}
        <nav className="flex items-center gap-6 sm:gap-8 text-neutral-400 font-medium text-xs tracking-widest uppercase">
          <a
            href="#about"
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            About
          </a>
          <a
            href="#skills"
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            Skills
          </a>
          <a
            href="#education"
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            Education
          </a>
          <a
            href="#contact"
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};
