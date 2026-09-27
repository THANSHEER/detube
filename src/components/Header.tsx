import React from 'react';
import { Github, Power, Search, X } from 'lucide-react';

interface HeaderProps {
  enabled: boolean;
  onToggle: () => void;
  isSearching: boolean;
  onToggleSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  enabled,
  onToggle,
  isSearching,
  onToggleSearch,
}) => {
  return (
    <header className="flex items-center justify-between gap-2">

      {/* Logo + wordmark */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={[
            'w-7 h-7 rounded-[var(--dt-radius-sm)] flex items-center justify-center shrink-0',
            '[background:var(--dt-gradient)] [box-shadow:var(--dt-shadow-accent)]',
            'transition-transform duration-300 ease-out hover:scale-105 active:scale-95',
            'cursor-default select-none',
          ].join(' ')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 100 100">
            <rect x="18" y="26" width="64" height="5" rx="2.5" fill="rgba(255,255,255,0.25)"/>
            <rect x="18" y="26" width="45" height="5" rx="2.5" fill="white"/>
            <circle cx="63" cy="28.5" r="9" fill="white"/>
            <rect x="18" y="48" width="64" height="5" rx="2.5" fill="rgba(255,255,255,0.25)"/>
            <rect x="18" y="48" width="18" height="5" rx="2.5" fill="white"/>
            <circle cx="36" cy="50.5" r="9" fill="white"/>
            <rect x="18" y="70" width="64" height="5" rx="2.5" fill="rgba(255,255,255,0.25)"/>
            <rect x="18" y="70" width="34" height="5" rx="2.5" fill="white"/>
            <circle cx="52" cy="72.5" r="9" fill="white"/>
          </svg>
        </div>

        <div className="flex flex-col gap-[2px] min-w-0">
          <h1 className="text-[13px] font-bold text-[var(--dt-text-primary)] tracking-tight leading-none">
            DeTube
          </h1>
          <span className="text-[9px] font-medium text-[var(--dt-text-secondary)] leading-none tracking-wide">
            Distraction-free YouTube
          </span>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5 shrink-0">

        {/* Quick Search Toggle */}
        <button
          title={!enabled ? 'Enable DeTube to search' : isSearching ? 'Close Search (Esc)' : 'Search settings (/)'}
          aria-label={isSearching ? 'Close Search' : 'Search settings'}
          disabled={!enabled}
          className={[
            'w-7 h-7 flex items-center justify-center',
            'rounded-[var(--dt-radius-sm)]',
            'transition-all duration-200 active:scale-90',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dt-accent)]',
            !enabled
              ? 'opacity-40 cursor-not-allowed text-[var(--dt-text-muted)] border border-transparent'
              : isSearching
                ? 'text-[var(--dt-accent)] bg-[var(--dt-accent-soft)] border border-[var(--dt-accent-border)]'
                : 'text-[var(--dt-text-muted)] hover:text-[var(--dt-text-secondary)] hover:bg-[var(--dt-surface-raised)] border border-transparent hover:border-[var(--dt-border)]',
          ].join(' ')}
          onClick={onToggleSearch}
        >
          {isSearching && enabled ? <X size={13} strokeWidth={2.2} /> : <Search size={13} strokeWidth={1.8} />}
        </button>

        {/* GitHub / Star */}
        <button
          title="Star on GitHub ⭐"
          aria-label="Star on GitHub"
          className={[
            'w-7 h-7 flex items-center justify-center',
            'rounded-[var(--dt-radius-sm)] text-[var(--dt-text-muted)]',
            'hover:text-[var(--dt-text-secondary)] hover:bg-[var(--dt-surface-raised)]',
            'border border-transparent hover:border-[var(--dt-border)]',
            'transition-all duration-200 active:scale-90',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dt-accent)]',
          ].join(' ')}
          onClick={() => chrome.tabs.create({ url: 'https://github.com/THANSHEER/detube' })}
        >
          <Github size={13} strokeWidth={1.8} />
        </button>

        {/* Divider */}
        <div className="w-px h-4 rounded-full bg-[var(--dt-border-strong)] mx-0.5" />

        {/* Power toggle */}
        <button
          role="switch"
          aria-checked={enabled}
          onClick={onToggle}
          title={enabled ? 'DeTube ON — click to disable' : 'DeTube OFF — click to enable'}
          aria-label={enabled ? 'DeTube enabled' : 'DeTube disabled'}
          className={[
            'w-7 h-7 rounded-[var(--dt-radius-sm)] flex items-center justify-center',
            'transition-all duration-250 active:scale-90 [transition-timing-function:var(--dt-spring)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dt-accent)]',
            enabled
              ? 'text-white [background:var(--dt-gradient)] [box-shadow:var(--dt-shadow-accent)]'
              : 'bg-[var(--dt-surface-raised)] text-[var(--dt-text-muted)] hover:text-[var(--dt-text-secondary)] border border-[var(--dt-border)] hover:border-[var(--dt-border-strong)]',
          ].join(' ')}
        >
          <Power size={13} strokeWidth={enabled ? 2.5 : 2} className="transition-transform duration-300" />
        </button>
      </div>
    </header>
  );
};
