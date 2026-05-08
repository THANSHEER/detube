/**
 * DeTube Storage Layer
 *
 * Settings type and defaults are derived from the centralized config registry.
 * This module provides the storage API used by both the popup and background script.
 * The content script uses a lightweight inline version to avoid code-splitting issues.
 */

import { SETTING_REGISTRY, buildDefaults } from './config';

// ---------------------------------------------------------------------------
// Settings type — generated from registry keys
// ---------------------------------------------------------------------------

/**
 * Settings interface.
 * The `enabled` field is the master toggle.
 * All other keys correspond to entries in SETTING_REGISTRY.
 */
export type Settings = { enabled: boolean } & {
  [K in (typeof SETTING_REGISTRY)[number]['key']]: boolean;
};

// ---------------------------------------------------------------------------
// Defaults — derived from registry
// ---------------------------------------------------------------------------

export const DEFAULTS = buildDefaults() as Settings;

// ---------------------------------------------------------------------------
// Storage API
// ---------------------------------------------------------------------------

export const DeTubeStorage = {
  getSettings(): Promise<Settings> {
    return new Promise((resolve) => {
      chrome.storage.local.get(DEFAULTS, (items) => {
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
      chrome.storage.local.set(settings, () => {
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
          (newSettings as Record<string, boolean>)[key] = value.newValue;
        }
        callback(newSettings);
      }
    });
  },
};
