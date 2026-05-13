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
      className={`
        flex items-center gap-3 px-3 py-2.5 w-full
        cursor-pointer select-none group transition-colors duration-150 relative
        focus-visible:outline-none focus-visible:bg-[var(--dt-surface-overlay)]
        ${checked ? 'bg-[var(--dt-accent-soft)]/30' : 'hover:bg-[var(--dt-surface-overlay)]'}
        ${isChild ? 'pl-9' : ''}
      `}
    >
      {/* Optional indentation indicator for children */}
      {isChild && (
        <div
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[var(--dt-text-muted)] opacity-50"
        />
      )}

      {/* Icon badge */}
      <div
        className={`w-7 h-7 shrink-0 rounded-[var(--dt-radius-sm)] flex items-center justify-center transition-all duration-150 ${
          checked
            ? 'text-white'
            : 'bg-[var(--dt-surface)] text-[var(--dt-text-muted)] border border-[var(--dt-border)] group-hover:text-[var(--dt-accent)] group-hover:border-[var(--dt-accent-border)]'
        }`}
        style={checked ? {
          background: 'var(--dt-gradient)',
          boxShadow: 'var(--dt-shadow-accent)',
        } : undefined}
      >
        <Icon size={14} strokeWidth={checked ? 2.5 : 2} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={`text-[12.5px] font-medium leading-tight truncate transition-colors duration-150 ${
          checked ? 'text-[var(--dt-text-primary)] font-semibold' : 'text-[var(--dt-text-secondary)] group-hover:text-[var(--dt-text-primary)]'
        }`}>
          {label}
        </p>
      </div>

      {/* Toggle switch */}
      <div className="shrink-0 ml-1">
        <div
          className={`relative w-[36px] h-[20px] rounded-full border transition-all duration-200 ${
            checked ? 'border-transparent' : 'bg-[var(--dt-toggle-off)] border-[var(--dt-border)]'
          }`}
          style={checked ? { background: 'var(--dt-gradient)' } : undefined}
        >
          <div
            className={`absolute top-[3px] left-[3px] w-[14px] h-[14px] rounded-full bg-[var(--dt-toggle-thumb)] transition-all duration-200 will-change-transform ${
              checked ? 'translate-x-[16px]' : 'translate-x-0'
            }`}
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}
          />
        </div>
      </div>
    </div>
  );
};
