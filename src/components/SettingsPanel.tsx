import React from 'react';
import { Sun, Moon, Monitor, Github, ExternalLink, Heart, Star } from 'lucide-react';
import { type ThemeMode } from '../lib/storage';

interface SettingsPanelProps {
  theme: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
  browser: string;
}

const THEME_OPTIONS: { mode: ThemeMode; Icon: typeof Sun; label: string }[] = [
  { mode: 'light',  Icon: Sun,     label: 'Light'  },
  { mode: 'system', Icon: Monitor, label: 'System' },
  { mode: 'dark',   Icon: Moon,    label: 'Dark'   },
];

const BROWSER_DISPLAY_NAMES: Record<string, string> = {
  chrome:  'Google Chrome',
  firefox: 'Mozilla Firefox',
  edge:    'Microsoft Edge',
  safari:  'Apple Safari',
  opera:   'Opera',
};

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  theme,
  onThemeChange,
  browser,
}) => {
  const browserName = BROWSER_DISPLAY_NAMES[browser] || browser;

  return (
    <div className="dt-settings-panel animate-tab-enter">


      {/* ── Appearance — single inline row ── */}
      <section className="flex items-center justify-between gap-3">
        <p className="dt-settings-section-title" style={{ marginBottom: 0 }}>Appearance</p>
        <div className="flex items-center border border-[var(--dt-border)] rounded-[8px] overflow-hidden bg-[var(--dt-surface-raised)] shrink-0 p-0.5 gap-0.5">
          {THEME_OPTIONS.map(({ mode, Icon, label }) => (
            <button
              key={mode}
              onClick={() => onThemeChange(mode)}
              title={label}
              aria-pressed={theme === mode}
              className={[
                'w-[28px] h-[24px] rounded-[6px] flex items-center justify-center border-none cursor-pointer outline-none',
                'transition-all duration-200 active:scale-90',
                'focus-visible:outline-2 focus-visible:outline-[var(--dt-accent)] focus-visible:outline-offset-[-2px]',
                theme === mode
                  ? 'text-white [background:var(--dt-gradient)] shadow-sm'
                  : 'bg-transparent text-[var(--dt-text-muted)] hover:text-[var(--dt-text-primary)] hover:bg-[var(--dt-surface-overlay)]',
              ].join(' ')}
            >
              <Icon size={12} strokeWidth={theme === mode ? 2.4 : 1.7} />
            </button>
          ))}
        </div>
      </section>

      {/* ── Browser ── */}
      <section>
        <p className="dt-settings-section-title">Browser</p>
        <div className="dt-browser-badge">
          <div className="dt-browser-badge-dot" />
          <span className="dt-browser-badge-name">{browserName}</span>
          <span className="dt-browser-badge-version">Active</span>
        </div>
      </section>

      {/* ── About ── */}
      <section>
        <p className="dt-settings-section-title">About</p>
        <div className="flex flex-col gap-1.5">
          <div className="dt-about-row">
            <span className="dt-about-label">DeTube</span>
            <span className="dt-about-value">
              v{typeof chrome !== 'undefined' && chrome.runtime?.getManifest ? chrome.runtime.getManifest().version : '3.4.0'}
            </span>
          </div>
          <div className="dt-about-row">
            <span className="dt-about-label">By GeekStash.dev</span>
            <button
              className="dt-about-value flex items-center gap-1 hover:text-[var(--dt-accent)] transition-colors duration-150 cursor-pointer border-none bg-transparent p-0 active:scale-95"
              onClick={() => chrome.tabs.create({ url: 'https://geekstash.dev' })}
            >
              Visit <ExternalLink size={9} />
            </button>
          </div>
          <div className="dt-about-row">
            <span className="dt-about-label">Source Code</span>
            <button
              className="dt-about-value flex items-center gap-1 hover:text-[var(--dt-accent)] transition-colors duration-150 cursor-pointer border-none bg-transparent p-0 active:scale-95"
              onClick={() => chrome.tabs.create({ url: 'https://github.com/THANSHEER/detube' })}
            >
              GitHub <Github size={9} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Support ── */}
      <section>
        <p className="dt-settings-section-title">Support & Community</p>
        <div className="flex flex-col gap-2">
          {/* Star on GitHub */}
          <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-[var(--dt-surface-raised)] border border-[var(--dt-border)] transition-transform duration-150 hover:-translate-y-0.5">
            <div className="flex items-center gap-2 min-w-0">
              <Star size={14} className="text-amber-400 fill-amber-400 shrink-0" />
              <span className="text-[12px] text-[var(--dt-text-secondary)]">Star on GitHub</span>
            </div>
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-[6px] bg-[var(--dt-surface-overlay)] hover:bg-[var(--dt-surface-hover)] text-[var(--dt-text-primary)] border border-[var(--dt-border)] active:scale-95 transition-all duration-150 cursor-pointer text-[11px] font-medium shrink-0"
              onClick={() => chrome.tabs.create({ url: 'https://github.com/THANSHEER/detube' })}
            >
              Star Repo <ExternalLink size={10} />
            </button>
          </div>

          {/* Buy Me Coffee */}
          <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-[var(--dt-surface-raised)] border border-[var(--dt-border)] transition-transform duration-150 hover:-translate-y-0.5">
            <div className="flex items-center gap-2 min-w-0">
              <Heart size={14} className="text-red-500 animate-pulse shrink-0" />
              <span className="text-[12px] text-[var(--dt-text-secondary)]">Enjoy DeTube?</span>
            </div>
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-[6px] bg-[var(--dt-accent)] text-white hover:opacity-90 active:scale-95 transition-all duration-150 cursor-pointer border-none text-[11px] font-medium shadow-sm shrink-0"
              onClick={() => chrome.tabs.create({ url: 'https://ko-fi.com/P0R02009G7' })}
            >
              Buy Me Coffee <ExternalLink size={10} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
