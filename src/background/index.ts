/**
 * DeTube Background Service Worker
 *
 * Responsibilities:
 * 1. Set badge text/color based on enabled state
 * 2. On install/update, inject content script + CSS into already-open YouTube tabs
 *    so users don't need to manually refresh the page.
 */

import { DeTubeStorage } from '../lib/storage';

// ---------------------------------------------------------------------------
// Badge management
// ---------------------------------------------------------------------------

const BADGE_ON = { text: 'ON', color: '#ff0000' };
const BADGE_OFF = { text: 'OFF', color: '#F44336' };

function updateBadge(enabled: boolean): void {
  const { text, color } = enabled ? BADGE_ON : BADGE_OFF;
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color });
}

// Set initial badge on startup
DeTubeStorage.getSettings()
  .then((s) => updateBadge(s.enabled))
  .catch((err) => console.error('DeTube: Background init error', err));

// Update badge when settings change
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.enabled) {
    updateBadge(changes.enabled.newValue);
  }
});

// ---------------------------------------------------------------------------
// Auto-inject on install/update — so extension works without page refresh
// ---------------------------------------------------------------------------

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // Open thank you page on first install
    chrome.tabs.create({ url: 'https://geekstash.dev/detube/thanks' });

    // Set uninstall URL (feedback/survey page)
    chrome.runtime.setUninstallURL('https://geekstash.dev/detube/uninstall');
  }

  if (details.reason === 'install' || details.reason === 'update') {
    console.log(`DeTube: Extension ${details.reason}ed — injecting into open YouTube tabs`);

    try {
      const tabs = await chrome.tabs.query({ url: '*://*.youtube.com/*' });

      for (const tab of tabs) {
        if (!tab.id) continue;

        try {
          // Inject CSS first (instant visual effect)
          await chrome.scripting.insertCSS({
            target: { tabId: tab.id },
            files: ['content/detube.css'],
          });

          // Then inject the content script
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js'],
          });

          console.log(`DeTube: Injected into tab ${tab.id} (${tab.url})`);
        } catch (tabErr) {
          // Tab might be restricted (e.g. chrome:// pages) — skip silently
          console.warn(`DeTube: Could not inject into tab ${tab.id}:`, tabErr);
        }
      }
    } catch (err) {
      console.error('DeTube: Auto-injection failed:', err);
    }
  }
});
