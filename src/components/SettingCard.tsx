import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SettingCardProps {
  label: string;
  Icon: LucideIcon;
  checked: boolean;
  onToggle: () => void;
  isChild?: boolean;
}

export const SettingCard: React.FC<SettingCardProps> = ({
  label,
  Icon,
  checked,
  onToggle,
  isChild = false,
}) => {
  return (
    <div
      role="switch"
      aria-checked={checked}
      aria-label={label}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onToggle(); }
      }}
      className={[
        'flex items-center gap-2.5 px-3 py-2.5 w-full',
        'cursor-pointer select-none group',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:bg-[var(--dt-surface-overlay)]',
        checked
          ? 'bg-[var(--dt-accent-soft)]'
          : 'hover:bg-[var(--dt-surface-overlay)]',
        isChild ? 'pl-8' : '',
      ].join(' ')}
    >
      {/* Indent dot for child settings */}
      {isChild && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[3px] h-[3px] rounded-full bg-[var(--dt-text-muted)] opacity-40" />
      )}

      {/* Icon */}
      <div
        className={[
          'w-6 h-6 shrink-0 rounded-[6px] flex items-center justify-center',
          'transition-all duration-200',
          checked
            ? 'text-white [background:var(--dt-gradient)] [box-shadow:0_2px_8px_rgba(99,102,241,0.22)]'
            : [
                'bg-[var(--dt-surface)] text-[var(--dt-text-primary)]',
                'border border-[var(--dt-border)]',
                'group-hover:text-[var(--dt-accent)] group-hover:border-[var(--dt-accent-border)] group-hover:bg-[var(--dt-accent-soft)]',
              ].join(' '),
        ].join(' ')}
      >
        <Icon size={12} strokeWidth={checked ? 2.5 : 2} />
      </div>

      {/* Label */}
      <p
        className={[
          'flex-1 min-w-0 text-[12.5px] font-medium leading-tight truncate',
          'transition-colors duration-150',
          checked
            ? 'text-[var(--dt-text-primary)] font-semibold'
            : 'text-[var(--dt-text-primary)] font-medium',
        ].join(' ')}
      >
        {label}
      </p>

      {/* Toggle — iOS style */}
      <div className="shrink-0 ml-0.5">
        <div
          className={[
            'relative w-[34px] h-[19px] rounded-full',
            'transition-all duration-200 ease-out',
            checked
              ? 'bg-[var(--dt-accent)]'
              : 'bg-[var(--dt-toggle-off)]',
          ].join(' ')}
        >
          <div
            className={[
              'absolute top-[2px] left-[2px] w-[15px] h-[15px] rounded-full',
              'bg-[var(--dt-toggle-thumb)]',
              '[box-shadow:0_1px_4px_rgba(0,0,0,0.25)]',
              'transition-transform duration-[200ms] [transition-timing-function:cubic-bezier(0.2,0,0,1)]',
              'will-change-transform',
              checked ? 'translate-x-[15px]' : 'translate-x-0',
            ].join(' ')}
          />
        </div>
      </div>
    </div>
  );
};
