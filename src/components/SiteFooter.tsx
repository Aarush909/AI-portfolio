import React, { useState } from 'react';
import { Check, Copy, Mail, Instagram } from 'lucide-react';
import { PortfolioData } from '../types';

interface SiteFooterProps {
  data: PortfolioData;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ data }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <footer
      id="contact"
      className="w-full bg-black text-white px-6 sm:px-10 md:px-14 lg:px-16 pt-16 sm:pt-24 pb-12 border-t border-neutral-900"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Header in Footer */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-neutral-900">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-medium block">
              CONTACT & INQUIRIES
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-condensed uppercase tracking-tight text-white leading-[0.9]">
              LET'S COLLABORATE
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 font-light max-w-lg leading-relaxed">
              Open for editorial commissions, visual identity direction, and modern web development.
            </p>
          </div>
        </div>

        {/* Contact Links Grid: Email and Instagram handles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs sm:text-sm max-w-xl">
          {/* Email */}
          <div className="space-y-2 group">
            <div className="flex items-center gap-2 text-neutral-500 font-mono text-[11px] tracking-widest uppercase">
              <Mail className="w-3.5 h-3.5" />
              <span>EMAIL INQUIRIES</span>
            </div>
            <button
              onClick={() => handleCopy(data.email, 'email')}
              className="flex items-center gap-2 text-white hover:text-neutral-300 transition-colors text-left font-medium cursor-pointer"
              title="Click to copy email address"
            >
              <span>{data.email}</span>
              {copiedKey === 'email' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Copy className="w-3 h-3 text-neutral-600 group-hover:text-neutral-400 shrink-0 transition-colors" />
              )}
            </button>
          </div>

          {/* Instagram Handle */}
          <div className="space-y-2 group">
            <div className="flex items-center gap-2 text-neutral-500 font-mono text-[11px] tracking-widest uppercase">
              <Instagram className="w-3.5 h-3.5" />
              <span>INSTAGRAM</span>
            </div>
            <button
              onClick={() => handleCopy(data.handle, 'handle')}
              className="flex items-center gap-2 text-white hover:text-neutral-300 transition-colors text-left font-medium cursor-pointer"
              title="Click to copy Instagram handle"
            >
              <span>{data.handle}</span>
              {copiedKey === 'handle' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Copy className="w-3 h-3 text-neutral-600 group-hover:text-neutral-400 shrink-0 transition-colors" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom Line (Date removed) */}
        <div className="pt-12 border-t border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>{data.category}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
