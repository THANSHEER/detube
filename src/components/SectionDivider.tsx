import React from 'react';

interface SectionDividerProps {
  title: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ title }) => {
  return (
    <div className="flex items-center gap-2 mb-2 mt-0.5 px-0.5">
      <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--dt-text-primary)] whitespace-nowrap shrink-0">
        {title}
      </span>
      <div className="h-px flex-1 bg-[var(--dt-border)]" />
    </div>
  );
};
