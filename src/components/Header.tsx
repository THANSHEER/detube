import React from 'react';
import { Github } from 'lucide-react';

interface HeaderProps {
  enabled: boolean;
  onToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ enabled, onToggle }) => {
  return (
    <header className="flex items-center justify-between">

      {/* Logo + wordmark */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-8 h-8 rounded-[var(--dt-radius-sm)] flex items-center justify-center shrink-0"
          style={{ background: 'var(--dt-gradient)', boxShadow: 'var(--dt-shadow-accent)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
            fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="3" rx="2"/>
            <path d="M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z" fill="white" stroke="none"/>
            <path d="M7 21h10"/>
          </svg>
        </div>

        <div className="flex flex-col gap-0.5 min-w-0">
          <h1 className="text-[14px] font-extrabold text-[var(--dt-text-primary)] tracking-tight leading-none">
            DeTube
          </h1>
          <span className="text-[9.5px] font-semibold text-[var(--dt-text-muted)] leading-none tracking-wide">
            Distraction-free YouTube
          </span>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2.5 shrink-0">

        {/* GitHub */}
        <button
          title="View on GitHub"
          className="w-[28px] h-[28px] flex items-center justify-center rounded-[var(--dt-radius-sm)] text-[var(--dt-text-muted)] hover:text-[var(--dt-text-primary)] hover:bg-[var(--dt-surface-raised)] border border-transparent hover:border-[var(--dt-border)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dt-accent)]"
          onClick={() => chrome.tabs.create({ url: 'https://github.com/THANSHEER/detube' })}
        >
          <Github size={14} strokeWidth={1.8} />
        </button>

        {/* Divider */}
        <div className="w-px h-5 rounded-full" style={{ background: 'var(--dt-border-strong)' }} />

        {/* ON / OFF label + toggle */}
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold tracking-wider uppercase leading-none transition-colors duration-200"
            style={{ color: enabled ? 'var(--dt-accent)' : 'var(--dt-text-muted)' }}
          >
            {enabled ? 'ON' : 'OFF'}
          </span>
          <button
            role="switch"
            aria-checked={enabled}
            onClick={onToggle}
            title={enabled ? 'DeTube ON — click to disable' : 'DeTube OFF — click to enable'}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dt-accent)] focus-visible:ring-offset-1 rounded-full"
          >
            <div
              className={`w-[42px] h-[24px] rounded-full border transition-all duration-200 relative ${
                enabled ? 'border-transparent' : 'bg-[var(--dt-toggle-off)] border-[var(--dt-border)]'
              }`}
              style={enabled ? { background: 'var(--dt-gradient)', boxShadow: '0 0 0 3px var(--dt-accent-glow)' } : undefined}
            >
              <div
                className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-[var(--dt-toggle-thumb)] transition-all duration-200 ${
                  enabled ? 'translate-x-[18px]' : 'translate-x-0'
                }`}
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.18)' }}
              />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
