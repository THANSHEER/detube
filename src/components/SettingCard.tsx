import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SettingCardProps {
  label: string;
  Icon: LucideIcon;
  checked: boolean;
  onToggle: () => void;
  isChild?: boolean;
  categoryName?: string;
}

export const SettingCard: React.FC<SettingCardProps> = ({
  label,
  Icon,
  checked,
  onToggle,
  isChild = false,
  categoryName,
}) => {
  return (
    <div
      role="switch"
      aria-checked={checked}
      aria-label={label}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onToggle();
        }
      }}
      className={[
        'flex items-center gap-3 px-[13px] py-[10.5px] w-full relative',
        'cursor-pointer select-none group',
        'transition-all duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--dt-accent)] focus-visible:bg-[var(--dt-surface-overlay)]',
        'active:scale-[0.985]',
        checked
          ? 'bg-[var(--dt-accent-soft)] hover:bg-[rgba(255,0,0,0.15)]'
          : 'hover:bg-[var(--dt-surface-overlay)]',
        isChild ? 'pl-9' : '',
      ].join(' ')}
    >
      {/* Indent dot for child settings */}
      {isChild && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[3px] h-[3px] rounded-full bg-[var(--dt-text-muted)] opacity-50" />
      )}

      {/* Icon */}
      <div
        className={[
          'w-[26px] h-[26px] shrink-0 rounded-[8px] flex items-center justify-center',
          'transition-all duration-250 [transition-timing-function:var(--dt-spring)]',
          'group-active:scale-90',
          checked
            ? 'text-white [background:var(--dt-gradient)] [box-shadow:var(--dt-shadow-accent)]'
            : [
                'bg-[var(--dt-surface)] text-[var(--dt-text-primary)]',
                'border border-[var(--dt-border)]',
                'group-hover:text-[var(--dt-accent)] group-hover:border-[var(--dt-accent-border)] group-hover:bg-[var(--dt-accent-soft)]',
              ].join(' '),
        ].join(' ')}
      >
        <Icon size={12} strokeWidth={checked ? 2.5 : 2} className="transition-transform duration-200 group-hover:scale-110" />
      </div>

      {/* Label and Category badge */}
      <div className="flex-1 min-w-0 pr-1">
        <p
          className={[
            'text-[12.5px] leading-tight truncate transition-colors duration-150',
            checked
              ? 'text-[var(--dt-text-primary)] font-semibold'
              : 'text-[var(--dt-text-primary)] font-medium',
          ].join(' ')}
        >
          {label}
        </p>
        {categoryName && (
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--dt-text-muted)] mt-0.5 block">
            {categoryName}
          </span>
        )}
      </div>

      {/* Toggle — iOS style with stretch physics */}
      <div className="shrink-0 ml-1">
        <div
          className={[
            'relative w-[36px] h-[20px] rounded-full',
            'transition-colors duration-250 [transition-timing-function:var(--dt-spring)]',
            checked
              ? 'bg-[var(--dt-toggle-on)]'
              : 'bg-[var(--dt-toggle-off)]',
          ].join(' ')}
        >
          <div
            className={[
              'absolute top-[2px] left-[2px] w-[16px] h-[16px] rounded-full',
              'bg-[var(--dt-toggle-thumb)]',
              'shadow-[0_1px_3px_rgba(0,0,0,0.3)]',
              'transition-all duration-250 [transition-timing-function:var(--dt-spring-bounce)]',
              'group-active:w-[19px]',
              checked ? 'translate-x-[16px] group-active:translate-x-[13px]' : 'translate-x-0',
            ].join(' ')}
          />
        </div>
      </div>
    </div>
  );
};
