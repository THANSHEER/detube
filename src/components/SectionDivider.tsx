import React from 'react';

interface SectionDividerProps {
  title: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ title }) => {
  return (
    <div className="flex items-center gap-3 mb-2 mt-1 px-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--dt-text-secondary)] whitespace-nowrap shrink-0">
        {title}
      </span>
      <div className="h-px flex-1 bg-[var(--dt-border)]" />
    </div>
  );
};
