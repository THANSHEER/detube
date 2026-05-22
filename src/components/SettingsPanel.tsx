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

      {/* ── Theme ── */}
      <section>
        <p className="dt-settings-section-title">Appearance</p>
        <div className="dt-theme-group">
          {THEME_OPTIONS.map(({ mode, Icon, label }) => (
            <button
              key={mode}
              onClick={() => onThemeChange(mode)}
              title={`${label} mode`}
              aria-pressed={theme === mode}
              className={`dt-theme-btn ${theme === mode ? 'active' : ''}`}
            >
              <Icon size={14} strokeWidth={theme === mode ? 2.5 : 1.8} />
              {label}
            </button>
          ))}
        </div>
        <p className="text-[9px] mt-2 px-1 text-[var(--dt-text-muted)]">
          System follows your OS light/dark preference automatically.
        </p>
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
            <span className="dt-about-value">v2.0.1</span>
          </div>
          <div className="dt-about-row">
            <span className="dt-about-label">By GeekStash.dev</span>
            <button
              className="dt-about-value flex items-center gap-1 hover:text-[var(--dt-accent)] transition-colors cursor-pointer border-none bg-transparent p-0"
              onClick={() => chrome.tabs.create({ url: 'https://geekstash.dev' })}
            >
              Visit <ExternalLink size={9} />
            </button>
          </div>
          <div className="dt-about-row">
            <span className="dt-about-label">Source Code</span>
            <button
              className="dt-about-value flex items-center gap-1 hover:text-[var(--dt-accent)] transition-colors cursor-pointer border-none bg-transparent p-0"
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
