import { DeTubeStorage, DeTubeFocus, type FocusConfig } from '../lib/storage';

const ALARM_TICK = 'detube-tick';

// ---------------------------------------------------------------------------
// Badge helpers
// ---------------------------------------------------------------------------

function setBadge(text: string, color: string): void {
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color });
}

function formatBadgeMins(totalMins: number): string {
  if (totalMins < 60) return `${totalMins}m`;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return m > 0 ? `${h}h${m}m` : `${h}h`;
}

async function refreshBadge(): Promise<void> {
  const [settings, config] = await Promise.all([
    DeTubeStorage.getSettings(),
    DeTubeFocus.getConfig(),
  ]);

  if (!settings.enabled) {
    setBadge('OFF', '#71717a');
    return;
  }

  if (config.blockingMode === 'timer' && config.timerEndTime) {
    const remaining = config.timerEndTime - Date.now();
    if (remaining > 0) {
      const mins = Math.ceil(remaining / 60000);
      setBadge(formatBadgeMins(mins).slice(0, 4), '#6366f1');
      return;
    }
  }

  if (config.blockingMode === 'daily-limit') {
    const today = getTodayDate();
    const usedSec = config.dailyResetDate === today ? config.dailyUsedSeconds : 0;
    const remainingSec = config.dailyLimitMinutes * 60 - usedSec;
    if (remainingSec > 0) {
      const mins = Math.ceil(remainingSec / 60);
      setBadge(formatBadgeMins(mins).slice(0, 4), '#6366f1');
      return;
    }
  }

  setBadge('ON', '#6366f1');
}

// ---------------------------------------------------------------------------
// Date / schedule helpers
// ---------------------------------------------------------------------------

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function isConsecutiveDay(prev: string, today: string): boolean {
  if (!prev) return false;
  return new Date(today).getTime() - new Date(prev).getTime() === 86400000;
}

function isScheduleNowActive(config: FocusConfig): boolean {
  if (!config.scheduleEnabled) return false;
  const now = new Date();
  const day = now.getDay();
  if (!config.scheduleDays.includes(day)) return false;
  const [sh, sm] = config.scheduleStartTime.split(':').map(Number);
  const [eh, em] = config.scheduleEndTime.split(':').map(Number);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  return nowMins >= sh * 60 + sm && nowMins < eh * 60 + em;
}

// ---------------------------------------------------------------------------
// Tick — fires every minute
// ---------------------------------------------------------------------------

async function onTick(): Promise<void> {
  const [settings, config, stats] = await Promise.all([
    DeTubeStorage.getSettings(),
    DeTubeFocus.getConfig(),
    DeTubeFocus.getStats(),
  ]);

  const today = getTodayDate();

  // Daily usage reset
  if (config.dailyResetDate !== today) {
    await DeTubeFocus.saveConfig({ dailyUsedSeconds: 0, dailyResetDate: today });
  }

  // Record focus minute if extension is active
  if (settings.enabled) {
    const isNewDay = stats.lastActiveDate !== today;
    await DeTubeFocus.saveStats({
      focusMinutesToday: isNewDay ? 1 : stats.focusMinutesToday + 1,
      focusMinutesTotal: stats.focusMinutesTotal + 1,
      streak: isNewDay
        ? (isConsecutiveDay(stats.lastActiveDate, today) ? stats.streak + 1 : 1)
        : stats.streak,
      lastActiveDate: today,
    });
  }

  // Timer mode: auto-expire
  if (config.blockingMode === 'timer' && config.timerEndTime && settings.enabled) {
    if (Date.now() >= config.timerEndTime) {
      await Promise.all([
        DeTubeFocus.saveConfig({ timerEndTime: null }),
        DeTubeStorage.saveSettings({ enabled: false }),
      ]);
      setBadge('OFF', '#71717a');
      return;
    }
  }

  // Schedule mode: auto-enable/disable
  if (config.blockingMode === 'schedule') {
    const shouldBeActive = isScheduleNowActive(config);
    if (shouldBeActive !== settings.enabled) {
      await DeTubeStorage.saveSettings({ enabled: shouldBeActive });
    }
  }

  // Daily limit mode: auto-disable when exceeded
  if (config.blockingMode === 'daily-limit' && settings.enabled) {
    const usedSec = config.dailyResetDate === today ? config.dailyUsedSeconds : 0;
    if (usedSec >= config.dailyLimitMinutes * 60) {
      await DeTubeStorage.saveSettings({ enabled: false });
    }
  }

  await refreshBadge();
}

// ---------------------------------------------------------------------------
// Message handler (from content script and popup)
// ---------------------------------------------------------------------------

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.action === 'addUsageTime') {
    const seconds: number = msg.seconds ?? 30;
    (async () => {
      const [config, settings] = await Promise.all([
        DeTubeFocus.getConfig(),
        DeTubeStorage.getSettings(),
      ]);
      const today = getTodayDate();
      const currentUsed = config.dailyResetDate === today ? config.dailyUsedSeconds : 0;
      const newUsed = currentUsed + seconds;
      await DeTubeFocus.saveConfig({ dailyUsedSeconds: newUsed, dailyResetDate: today });

      if (config.blockingMode === 'daily-limit' && settings.enabled) {
        if (newUsed >= config.dailyLimitMinutes * 60) {
          await DeTubeStorage.saveSettings({ enabled: false });
          setBadge('OFF', '#71717a');
        } else {
          await refreshBadge();
        }
      }
      sendResponse({ ok: true });
    })();
    return true;
  }
});

// ---------------------------------------------------------------------------
// Alarm listener
// ---------------------------------------------------------------------------

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_TICK) {
    onTick().catch((err) => console.error('DeTube: Tick error', err));
  }
});

// ---------------------------------------------------------------------------
// Storage change → badge refresh
// ---------------------------------------------------------------------------

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && (changes['enabled'] || changes['focusConfig'])) {
    refreshBadge().catch(console.error);
  }
});

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

async function init(): Promise<void> {
  const existing = await chrome.alarms.get(ALARM_TICK);
  if (!existing) {
    chrome.alarms.create(ALARM_TICK, { periodInMinutes: 1 });
  }
  await onTick();
}

init().catch((err) => console.error('DeTube: Background init error', err));

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'https://geekstash.dev/detube/thanks' });
    chrome.runtime.setUninstallURL('https://geekstash.dev/detube/uninstall');
  }

  if (details.reason === 'install' || details.reason === 'update') {
    try {
      const tabs = await chrome.tabs.query({ url: '*://*.youtube.com/*' });
      for (const tab of tabs) {
        if (!tab.id) continue;
        try {
          await chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ['content/detube.css'] });
          await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
        } catch { /* restricted tab — skip */ }
      }
    } catch (err) {
      console.error('DeTube: Auto-injection failed:', err);
    }
  }

  chrome.alarms.create(ALARM_TICK, { periodInMinutes: 1 });
});
