import React, { useEffect } from 'react';
import { Sun, Moon, Monitor, Github, ExternalLink, Heart } from 'lucide-react';
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

  useEffect(() => {
    // Load Ko-fi widget script
    const script = document.createElement('script');
    script.src = 'https://storage.ko-fi.com/cdn/widget/Widget_2.js';
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as any).kofiwidget2) {
        (window as any).kofiwidget2.init('Support me on Ko-fi', '#000000', 'P0R02009G7');
        (window as any).kofiwidget2.draw();
      }
    };
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="dt-settings-panel animate-slide-up">


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

      {/* ── Support ── */}
      <section>
        <p className="dt-settings-section-title">Support</p>
        <div className="flex items-center justify-between p-3 rounded-[8px] bg-[var(--dt-surface-raised)] border border-[var(--dt-border)]">
          <div className="flex items-center gap-2">
            <Heart size={14} className="text-red-500" />
            <span className="text-[12px] text-[var(--dt-text-secondary)]">Enjoy DeTube?</span>
          </div>
          <div id="kofi-widget-container"></div>
        </div>
      </section>

    </div>
  );
};
