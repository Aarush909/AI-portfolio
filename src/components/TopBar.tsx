import React from 'react';

interface TopBarProps {
  category: string;
  date?: string;
  className?: string;
  onCategoryClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  category,
  className = '',
  onCategoryClick,
}) => {
  return (
    <div
      className={`w-full flex items-center justify-between text-xs sm:text-sm tracking-wider uppercase text-neutral-300 font-medium select-none ${className}`}
    >
      <div
        onClick={onCategoryClick}
        className="cursor-default hover:text-white transition-colors tracking-[0.18em] text-[11px] sm:text-xs text-neutral-300 font-semibold"
      >
        {category}
      </div>
    </div>
  );
};
