import React from 'react';
import { Github } from 'lucide-react';

interface HeaderProps {
  enabled: boolean;
  onToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ enabled, onToggle }) => {
  return (
    <header className="flex items-center justify-between pb-3 border-b border-[var(--dt-border)] mb-1">

      {/* Left: logo + wordmark */}
      <div className="flex items-center gap-2.5">
        {/* DeTube icon */}
        <div className="w-8 h-8 rounded-[var(--dt-radius-sm)] flex items-center justify-center bg-[var(--dt-accent-soft)] border border-[var(--dt-accent-border)] shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18" height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--dt-accent)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="14" x="2" y="3" rx="2"/>
            <path d="M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z"/>
            <path d="M7 21h10"/>
          </svg>
        </div>

        {/* Title + subtitle */}
        <div className="flex flex-col leading-tight">
          <h1 className="text-[13px] font-bold text-[var(--dt-text-primary)] flex items-center gap-1.5 tracking-tight">
            DeTube
          </h1>
          <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-[var(--dt-text-muted)]">
            Control your flow
          </span>
        </div>
      </div>

      {/* Right: GitHub + master toggle */}
      <div className="flex items-center gap-2">
        {/* GitHub link — open source indicator */}
        <a
          href="https://github.com/THANSHEER/detube"
          target="_blank"
          rel="noopener noreferrer"
          title="View on GitHub"
          className="w-7 h-7 flex items-center justify-center rounded-[var(--dt-radius-sm)] text-[var(--dt-text-muted)] hover:text-[var(--dt-text-secondary)] hover:bg-[var(--dt-surface-overlay)] transition-all"
          onClick={(e) => {
            e.preventDefault();
            chrome.tabs.create({ url: 'https://github.com/THANSHEER/detube' });
          }}
        >
          <Github size={15} strokeWidth={1.8} />
        </a>

        {/* Master enable toggle */}
        <label className="relative inline-flex items-center cursor-pointer" title={enabled ? 'DeTube ON' : 'DeTube OFF'}>
          <input
            type="checkbox"
            className="sr-only peer"
            checked={enabled}
            onChange={onToggle}
          />
          {/* Track */}
          <div className="w-11 h-6 rounded-full border border-[var(--dt-border)] bg-[var(--dt-toggle-off)] peer-checked:bg-[var(--dt-accent)] peer-checked:border-[var(--dt-accent)] transition-all relative">
            {/* Thumb */}
            <div className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-[var(--dt-toggle-thumb)] shadow-sm transition-all duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        </label>
      </div>
    </header>
  );
};
