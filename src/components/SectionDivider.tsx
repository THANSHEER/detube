import React from 'react';

interface SectionDividerProps {
  title: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ title }) => {
  return (
    <div className="flex items-center gap-1.5 px-1 mb-2">
      <div className="w-1 h-1 rounded-full shrink-0 [background:var(--dt-accent)]" />
      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--dt-text-secondary)] whitespace-nowrap">
        {title}
      </span>
    </div>
  );
};
