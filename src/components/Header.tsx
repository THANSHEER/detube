import React from 'react';
import { Github, Power } from 'lucide-react';

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
          className={[
            'w-8 h-8 rounded-[var(--dt-radius-sm)] flex items-center justify-center shrink-0',
            '[background:var(--dt-gradient)] [box-shadow:var(--dt-shadow-accent)]',
            'transition-all duration-300 ease-out hover:scale-105 hover:rotate-2',
            'cursor-default select-none animate-float',
          ].join(' ')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 100 100"
          >
            {/* D letterform — even-odd punches the bowl out, showing gradient bg through */}
            <path
              fillRule="evenodd"
              fill="white"
              d="M 14,14 L 56,14 C 90,14 90,86 56,86 L 14,86 Z M 28,28 L 54,28 C 76,28 76,72 54,72 L 28,72 Z"
            />
            {/* Play arrow centred in the transparent bowl */}
            <polygon fill="white" points="38,37 70,50 38,63"/>
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
          className={[
            'w-[28px] h-[28px] flex items-center justify-center',
            'rounded-[var(--dt-radius-sm)] text-[var(--dt-text-muted)]',
            'hover:text-[var(--dt-text-primary)] hover:bg-[var(--dt-surface-raised)]',
            'border border-transparent hover:border-[var(--dt-border)]',
            'transition-all duration-300 ease-out hover:scale-110 active:scale-95',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dt-accent)]',
          ].join(' ')}
          onClick={() => chrome.tabs.create({ url: 'https://github.com/THANSHEER/detube' })}
        >
          <Github size={14} strokeWidth={1.8} />
        </button>

        {/* Divider */}
        <div className="w-px h-5 rounded-full bg-[var(--dt-border-strong)]" />

        {/* Power toggle */}
        <button
          role="switch"
          aria-checked={enabled}
          onClick={onToggle}
          title={enabled ? 'DeTube ON — click to disable' : 'DeTube OFF — click to enable'}
          className={[
            'w-[28px] h-[28px] rounded-[var(--dt-radius-sm)] flex items-center justify-center',
            'transition-all duration-300 ease-out hover:scale-110 active:scale-95',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dt-accent)]',
            enabled
              ? 'text-white [background:var(--dt-gradient)] [box-shadow:var(--dt-shadow-accent)]'
              : 'bg-[var(--dt-surface-raised)] text-[var(--dt-text-muted)] hover:text-[var(--dt-text-primary)] border border-[var(--dt-border)]',
          ].join(' ')}
        >
          <Power size={14} strokeWidth={enabled ? 2.5 : 2} />
        </button>
      </div>
    </header>
  );
};
