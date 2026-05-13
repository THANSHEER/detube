/**
 * DeTube Content Script
 *
 * Injected into YouTube pages. Reads settings from chrome.storage and toggles
 * CSS classes on <html> to hide/show elements via the companion detube.css.
 *
 * All setting definitions and CSS class mappings come from the centralized
 * config registry (../lib/config.ts). Storage API from ../lib/storage.ts.
 *
 * NOTE: Vite bundles all imports into a single content.js — no code splitting.
 */

import { SETTING_TO_CSS_CLASS } from '../lib/config';
import { Settings, DEFAULTS, DeTubeStorage } from '../lib/storage';

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

class DeTubeEngine {
  private settings: Settings = { ...DEFAULTS };
  private isApplying = false;
  private applyScheduled = false;

  constructor() {
    this.init().catch((err) => {
      console.error('❌ DeTube: Initialization failed:', err);
    });
  }

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------

  private async init(): Promise<void> {
    console.log('🕹️ DeTube: Initializing...');

    try {
      this.settings = await DeTubeStorage.getSettings();
      console.log('📊 DeTube: Settings loaded:', this.settings.enabled ? 'ON' : 'OFF');

      // Apply immediately
      this.applyAll();

      // Listen for settings changes from popup
      DeTubeStorage.onChanged((changes) => {
        console.log('⚡ DeTube: Settings changed:', changes);
        Object.assign(this.settings, changes);
        this.scheduleApply();
      });

      // Watch for YouTube SPA navigation and DOM mutations
      this.observe();

      console.log('✅ DeTube: Ready');
    } catch (error) {
      console.error('❌ DeTube: Storage error:', error);
    }
  }

  // -------------------------------------------------------------------------
  // Class toggling — batched for performance
  // -------------------------------------------------------------------------

  /**
   * Schedule an apply on the next animation frame to coalesce rapid changes.
   */
  private scheduleApply(): void {
    if (this.applyScheduled) return;
    this.applyScheduled = true;
    requestAnimationFrame(() => {
      this.applyScheduled = false;
      this.applyAll();
    });
  }

  /**
   * Toggle all dt-* CSS classes on <html> based on current settings.
   */
  private applyAll(): void {
    if (this.isApplying) return;
    this.isApplying = true;

    try {
      const html = document.documentElement;

      if (!this.settings.enabled) {
        this.removeAllClasses();
        return;
      }

      // Batch: build list of classes to add/remove
      const toAdd: string[] = [];
      const toRemove: string[] = [];

      for (const [settingKey, cssClass] of Object.entries(SETTING_TO_CSS_CLASS)) {
        const value = (this.settings as Record<string, boolean>)[settingKey];
        if (value) {
          if (!html.classList.contains(cssClass)) {
            toAdd.push(cssClass);
          }
        } else {
          if (html.classList.contains(cssClass)) {
            toRemove.push(cssClass);
          }
        }
      }

      if (toRemove.length > 0) {
        html.classList.remove(...toRemove);
      }
      if (toAdd.length > 0) {
        html.classList.add(...toAdd);
      }

      if (toAdd.length > 0) {
        console.log(`🔄 DeTube: Applied ${toAdd.length} class(es)`);
      }
    } finally {
      this.isApplying = false;
    }
  }

  /**
   * Remove all dt-* classes (used when extension is disabled).
   */
  private removeAllClasses(): void {
    const html = document.documentElement;
    const dtClasses = Array.from(html.classList).filter((c) => c.startsWith('dt-'));
    if (dtClasses.length > 0) {
      html.classList.remove(...dtClasses);
      console.log('❌ DeTube: Disabled & classes removed');
    }
  }

  // -------------------------------------------------------------------------
  // Observation — SPA navigation + DOM changes
  // -------------------------------------------------------------------------

  private observe(): void {
    // 1. Watch for class attribute changes on <html> (YouTube may strip classes)
    const classObserver = new MutationObserver((mutations) => {
      if (!this.settings.enabled) return;

      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.target === document.documentElement) {
          const hasDtClasses = Array.from(document.documentElement.classList).some((c) =>
            c.startsWith('dt-')
          );
          if (!hasDtClasses) {
            this.scheduleApply();
            break;
          }
        }
      }
    });

    classObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // 2. Watch for DOM changes (YouTube dynamically loads content)
    const bodyTarget = document.body || document.documentElement;
    const bodyObserver = new MutationObserver(() => {
      if (!this.settings.enabled) return;
      this.scheduleApply();
    });

    bodyObserver.observe(bodyTarget, {
      childList: true,
      subtree: true,
    });

    // 3. Listen for YouTube SPA navigation events
    window.addEventListener('yt-navigate-finish', () => {
      if (this.settings.enabled) {
        this.scheduleApply();
      }
    });
  }
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

new DeTubeEngine();

// ---------------------------------------------------------------------------
// Message handler — popup queries login state from the active page
// ---------------------------------------------------------------------------

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'checkLogin') {
    const avatar = document.querySelector(
      '#avatar-btn, ytd-topbar-menu-button-renderer, .ytp-user-avatar, ytm-avatar-button, .ytm-profile-icon'
    );
    const signinPromo = document.querySelector(
      'ytd-guide-signin-promo-renderer, #signin-promo, .ytm-signin-promo-renderer'
    );
    const signinButton = document.querySelector(
      'a[aria-label*="Sign in" i], ytd-button-renderer:has(a[href*="login"]), .ytm-header-bar-signin-button'
    );

    const isLoggedIn = !!avatar && !signinPromo && !signinButton;

    sendResponse({ isLoggedIn, url: window.location.href });
  }
  return true;
});
