import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SettingCardProps {
  label: string;
  description: string;
  Icon: LucideIcon;
  checked: boolean;
  onToggle: () => void;
}

export const SettingCard: React.FC<SettingCardProps> = ({
  label,
  description,
  Icon,
  checked,
  onToggle,
}) => {
  return (
    <div
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className={`
        dt-card flex items-center gap-3 px-3 py-2.5 rounded-[var(--dt-radius)]
        border cursor-pointer select-none
        ${checked
          ? 'bg-[var(--dt-accent-soft)] border-[var(--dt-accent-border)]'
          : 'bg-[var(--dt-surface-overlay)] border-[var(--dt-border)] hover:border-[var(--dt-border-strong)] hover:bg-[var(--dt-surface-raised)]'
        }
      `}
    >
      {/* Icon */}
      <div className={`
        w-7 h-7 shrink-0 rounded-[var(--dt-radius-sm)] flex items-center justify-center
        ${checked
          ? 'bg-[var(--dt-accent)] text-white'
          : 'bg-[var(--dt-surface-raised)] text-[var(--dt-text-secondary)]'
        }
      `}>
        <Icon size={14} strokeWidth={checked ? 2.5 : 2} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={`text-[12px] font-semibold leading-tight truncate ${checked ? 'text-[var(--dt-text-primary)]' : 'text-[var(--dt-text-primary)]'}`}>
          {label}
        </p>
        <p className="text-[10px] text-[var(--dt-text-muted)] leading-tight truncate mt-0.5">
          {description}
        </p>
      </div>

      {/* Toggle */}
      <div className="shrink-0 relative inline-flex items-center pointer-events-none ml-1">
        <div className={`w-9 h-5 rounded-full border transition-all duration-200 relative
          ${checked
            ? 'bg-[var(--dt-accent)] border-[var(--dt-accent)]'
            : 'bg-[var(--dt-toggle-off)] border-[var(--dt-border)]'
          }`}
        >
          <div className={`absolute top-[2px] left-[2px] w-[15px] h-[15px] rounded-full bg-[var(--dt-toggle-thumb)] shadow-sm transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
        </div>
      </div>
    </div>
  );
};
