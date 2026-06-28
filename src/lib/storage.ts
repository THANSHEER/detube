import { SETTING_REGISTRY, ALL_SETTING_KEYS, buildDefaults } from './config';

// ---------------------------------------------------------------------------
// Focus / Blocking Mode
// ---------------------------------------------------------------------------

export type BlockingMode = 'always' | 'timer' | 'schedule' | 'daily-limit';

export interface FocusConfig {
  blockingMode: BlockingMode;
  timerDurationMinutes: number;
  timerEndTime: number | null;
  scheduleDays: number[];
  scheduleStartTime: string;
  scheduleEndTime: string;
  scheduleEnabled: boolean;
  dailyLimitMinutes: number;
  dailyUsedSeconds: number;
  dailyResetDate: string;
}

export const FOCUS_DEFAULTS: FocusConfig = {
  blockingMode: 'always',
  timerDurationMinutes: 60,
  timerEndTime: null,
  scheduleDays: [1, 2, 3, 4, 5],
  scheduleStartTime: '09:00',
  scheduleEndTime: '18:00',
  scheduleEnabled: false,
  dailyLimitMinutes: 60,
  dailyUsedSeconds: 0,
  dailyResetDate: '',
};

export interface FocusStats {
  focusMinutesToday: number;
  focusMinutesTotal: number;
  sessionCount: number;
  streak: number;
  lastActiveDate: string;
}

export const STATS_DEFAULTS: FocusStats = {
  focusMinutesToday: 0,
  focusMinutesTotal: 0,
  sessionCount: 0,
  streak: 0,
  lastActiveDate: '',
};

export const DeTubeFocus = {
  getConfig(): Promise<FocusConfig> {
    return new Promise((resolve) => {
      chrome.storage.local.get({ focusConfig: FOCUS_DEFAULTS }, (items) => {
        resolve({ ...FOCUS_DEFAULTS, ...(items['focusConfig'] as FocusConfig) });
      });
    });
  },

  saveConfig(patch: Partial<FocusConfig>): Promise<void> {
    return new Promise((resolve) => {
      DeTubeFocus.getConfig().then((current) => {
        chrome.storage.local.set({ focusConfig: { ...current, ...patch } }, () => resolve());
      });
    });
  },

  getStats(): Promise<FocusStats> {
    return new Promise((resolve) => {
      chrome.storage.local.get({ focusStats: STATS_DEFAULTS }, (items) => {
        resolve({ ...STATS_DEFAULTS, ...(items['focusStats'] as FocusStats) });
      });
    });
  },

  saveStats(patch: Partial<FocusStats>): Promise<void> {
    return new Promise((resolve) => {
      DeTubeFocus.getStats().then((current) => {
        chrome.storage.local.set({ focusStats: { ...current, ...patch } }, () => resolve());
      });
    });
  },

  onFocusChanged(callback: (config: FocusConfig) => void): void {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes['focusConfig']) {
        callback({ ...FOCUS_DEFAULTS, ...(changes['focusConfig'].newValue as FocusConfig) });
      }
    });
  },

  onStatsChanged(callback: (stats: FocusStats) => void): void {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes['focusStats']) {
        callback({ ...STATS_DEFAULTS, ...(changes['focusStats'].newValue as FocusStats) });
      }
    });
  },
};

// ---------------------------------------------------------------------------
// Theme — stored separately from boolean settings
// ---------------------------------------------------------------------------

export type ThemeMode = 'system' | 'light' | 'dark';

export const DeTubeTheme = {
  get(): Promise<ThemeMode> {
    return new Promise((resolve) => {
      chrome.storage.local.get({ theme: 'dark' }, (items) => {
        resolve((items['theme'] as ThemeMode) || 'dark');
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
    const validKeys = new Set(['enabled', ...ALL_SETTING_KEYS]);
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local') {
        const newSettings: Partial<Settings> = {};
        let hasSettingChange = false;
        for (const [key, value] of Object.entries(changes)) {
          if (validKeys.has(key)) {
            (newSettings as Record<string, unknown>)[key] = value.newValue;
            hasSettingChange = true;
          }
        }
        if (hasSettingChange) {
          callback(newSettings);
        }
      }
    });
  },
};
