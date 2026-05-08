import React from 'react';

interface SectionDividerProps {
  title: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ title }) => {
  return (
    <div className="flex items-center gap-2 mt-3 mb-1.5 first:mt-0">
      <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[var(--dt-text-muted)] whitespace-nowrap">
        {title}
      </span>
      <div className="flex-1 h-px bg-[var(--dt-border)]" />
    </div>
  );
};
