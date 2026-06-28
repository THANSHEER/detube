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
        'flex items-center gap-3 px-[14px] py-[11px] w-full',
        'cursor-pointer select-none group',
        'transition-all duration-300 [transition-timing-function:var(--dt-spring)]',
        'focus-visible:outline-none focus-visible:bg-[var(--dt-surface-overlay)]',
        'active:scale-[0.98]',
        checked
          ? 'bg-[var(--dt-accent-soft)]'
          : 'hover:bg-[var(--dt-surface-overlay)]',
        isChild ? 'pl-9' : '',
      ].join(' ')}
    >
      {/* Indent dot for child settings */}
      {isChild && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[3px] h-[3px] rounded-full bg-[var(--dt-text-muted)] opacity-40" />
      )}

      {/* Icon */}
      <div
        className={[
          'w-[26px] h-[26px] shrink-0 rounded-[8px] flex items-center justify-center',
          'transition-all duration-300 [transition-timing-function:var(--dt-spring)]',
          checked
            ? 'text-white [background:var(--dt-gradient)] [box-shadow:var(--dt-shadow-accent)]'
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
      <div className="shrink-0 ml-1">
        <div
          className={[
            'relative w-[38px] h-[22px] rounded-full',
            'transition-colors duration-300 [transition-timing-function:var(--dt-spring)]',
            checked
              ? 'bg-[var(--dt-toggle-on)]'
              : 'bg-[var(--dt-toggle-off)]',
          ].join(' ')}
        >
          <div
            className={[
              'absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full',
              'bg-[var(--dt-toggle-thumb)]',
              '[box-shadow:0_1px_4px_rgba(0,0,0,0.25)]',
              'transition-transform duration-300 [transition-timing-function:var(--dt-spring)]',
              'will-change-transform',
              checked ? 'translate-x-[16px]' : 'translate-x-0',
            ].join(' ')}
          />
        </div>
      </div>
    </div>
  );
};
