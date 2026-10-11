import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface FooterBarProps {
  website: string;
  handle: string;
  address: string;
  className?: string;
}

export const FooterBar: React.FC<FooterBarProps> = ({
  website,
  handle,
  address,
  className = '',
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <div
      className={`w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 text-xs sm:text-sm text-neutral-400 font-normal tracking-wide ${className}`}
    >
      {/* Website */}
      <button
        onClick={() => handleCopy(website, 'site')}
        className="group flex items-center gap-1.5 hover:text-white transition-colors text-left text-neutral-300 hover:underline cursor-pointer"
        title="Click to copy website URL"
      >
        <span>{website}</span>
        {copiedKey === 'site' ? (
          <Check className="w-3 h-3 text-emerald-400" />
        ) : (
          <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60 transition-opacity" />
        )}
      </button>

      {/* Social Handle */}
      <button
        onClick={() => handleCopy(handle, 'handle')}
        className="group flex items-center gap-1.5 hover:text-white transition-colors text-left text-neutral-300 hover:underline cursor-pointer"
        title="Click to copy handle"
      >
        <span>{handle}</span>
        {copiedKey === 'handle' ? (
          <Check className="w-3 h-3 text-emerald-400" />
        ) : (
          <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60 transition-opacity" />
        )}
      </button>

      {/* Address */}
      <button
        onClick={() => handleCopy(address, 'addr')}
        className="group flex items-center gap-1.5 hover:text-white transition-colors text-left sm:text-right text-neutral-400 cursor-pointer"
        title="Click to copy address"
      >
        <span>{address}</span>
        {copiedKey === 'addr' ? (
          <Check className="w-3 h-3 text-emerald-400" />
        ) : (
          <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60 transition-opacity" />
        )}
      </button>
    </div>
  );
};
