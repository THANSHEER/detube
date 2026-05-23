import React from 'react';
import { Sun, Moon, Monitor, Github, ExternalLink } from 'lucide-react';
import { type ThemeMode } from '../lib/storage';
import { FocusPanel } from './FocusPanel';

interface SettingsPanelProps {
  theme: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
  browser: string;
  onSetEnabled: (val: boolean) => Promise<void>;
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
  onSetEnabled,
}) => {
  const browserName = BROWSER_DISPLAY_NAMES[browser] || browser;

  return (
    <div className="dt-settings-panel animate-slide-up">

      {/* ── Focus Mode ── */}
      <FocusPanel onSetEnabled={onSetEnabled} />

      {/* ── Divider ── */}
      <div className="dt-settings-divider" />

      {/* ── Appearance — single inline row ── */}
      <section className="flex items-center justify-between gap-3">
        <p className="dt-settings-section-title" style={{ marginBottom: 0 }}>Appearance</p>
        <div className="flex items-center border border-[var(--dt-border)] rounded-[8px] overflow-hidden bg-[var(--dt-surface-raised)] shrink-0">
          {THEME_OPTIONS.map(({ mode, Icon, label }) => (
            <button
              key={mode}
              onClick={() => onThemeChange(mode)}
              title={label}
              aria-pressed={theme === mode}
              className={[
                'w-[30px] h-[26px] flex items-center justify-center border-none cursor-pointer outline-none',
                'transition-all duration-150',
                'focus-visible:outline-2 focus-visible:outline-[var(--dt-accent)] focus-visible:outline-offset-[-2px]',
                theme === mode
                  ? 'text-white [background:var(--dt-gradient)]'
                  : 'bg-transparent text-[var(--dt-text-muted)] hover:text-[var(--dt-text-secondary)] hover:bg-[var(--dt-surface-overlay)]',
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
            <span className="dt-about-value">v3.0.0</span>
          </div>
          <div className="dt-about-row">
            <span className="dt-about-label">By GeekStash.dev</span>
            <button
              className="dt-about-value flex items-center gap-1 hover:text-[var(--dt-accent)] transition-colors duration-150 cursor-pointer border-none bg-transparent p-0"
              onClick={() => chrome.tabs.create({ url: 'https://geekstash.dev' })}
            >
              Visit <ExternalLink size={9} />
            </button>
          </div>
          <div className="dt-about-row">
            <span className="dt-about-label">Source Code</span>
            <button
              className="dt-about-value flex items-center gap-1 hover:text-[var(--dt-accent)] transition-colors duration-150 cursor-pointer border-none bg-transparent p-0"
              onClick={() => chrome.tabs.create({ url: 'https://github.com/THANSHEER/detube' })}
            >
              GitHub <Github size={9} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
