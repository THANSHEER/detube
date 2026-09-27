import React from 'react';

interface SectionDividerProps {
  title: string;
  activeCount?: number;
  totalCount?: number;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  title,
  activeCount,
  totalCount,
}) => {
  return (
    <div className="flex items-center justify-between gap-2.5 mb-2 mt-1 px-1">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--dt-text-secondary)] whitespace-nowrap shrink-0">
          {title}
        </span>
        {totalCount !== undefined && totalCount > 0 && activeCount !== undefined && activeCount > 0 && (
          <span
            className="text-[8.5px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--dt-accent-soft)] text-[var(--dt-accent)] leading-none shrink-0"
            title={`${activeCount} of ${totalCount} active`}
          >
            {activeCount}/{totalCount}
          </span>
        )}
      </div>
      <div className="h-px flex-1 bg-[var(--dt-border)]" />
    </div>
  );
};
