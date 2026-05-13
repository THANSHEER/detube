import { SETTING_REGISTRY, buildDefaults } from './config';

// ---------------------------------------------------------------------------
// Theme — stored separately from boolean settings
// ---------------------------------------------------------------------------

export type ThemeMode = 'system' | 'light' | 'dark';

export const DeTubeTheme = {
  get(): Promise<ThemeMode> {
    return new Promise((resolve) => {
      chrome.storage.local.get({ theme: 'system' }, (items) => {
        resolve((items['theme'] as ThemeMode) || 'system');
      });
    });
  },

  save(theme: ThemeMode): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ theme }, () => resolve());
    });
  },

  onChange(callback: (theme: ThemeMode) => void) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes['theme']) {
        callback(changes['theme'].newValue as ThemeMode);
      }
    });
  },
};

// ---------------------------------------------------------------------------
// Settings type (boolean toggles only)
// ---------------------------------------------------------------------------

export type Settings = { enabled: boolean } & {
  [K in (typeof SETTING_REGISTRY)[number]['key']]: boolean;
};

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

export const DEFAULTS = buildDefaults() as Settings;

// ---------------------------------------------------------------------------
// Storage API
// ---------------------------------------------------------------------------

export const DeTubeStorage = {
  getSettings(): Promise<Settings> {
    return new Promise((resolve) => {
      chrome.storage.local.get(DEFAULTS as unknown as Record<string, unknown>, (items) => {
        if (chrome.runtime.lastError) {
          console.warn('DeTube: Error reading settings', chrome.runtime.lastError.message);
          resolve({ ...DEFAULTS });
        } else {
          resolve(items as Settings);
        }
      });
    });
  },

  saveSettings(settings: Partial<Settings>): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set(settings as Record<string, unknown>, () => {
        if (chrome.runtime.lastError) {
          console.warn('DeTube: Error saving settings', chrome.runtime.lastError.message);
        }
        resolve();
      });
    });
  },

  onChanged(callback: (changes: Partial<Settings>) => void) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local') {
        const newSettings: Partial<Settings> = {};
        for (const [key, value] of Object.entries(changes)) {
          (newSettings as Record<string, unknown>)[key] = value.newValue;
        }
        callback(newSettings);
      }
    });
  },
};
