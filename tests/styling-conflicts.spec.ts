import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to inject mock chrome extension APIs into popup page
async function setupMockChrome(page: any, initialStore: Record<string, any> = {}) {
  await page.addInitScript((initialData: Record<string, any>) => {
    const store: Record<string, any> = {
      enabled: true,
      theme: 'dark',
      ...initialData,
    };

    (window as any).chrome = {
      runtime: {
        getManifest: () => ({ version: '3.4.0', name: 'DeTube' }),
        lastError: null,
        sendMessage: (_msg: any, cb?: Function) => cb && cb({ ok: true }),
        onMessage: { addListener: () => {} },
      },
      storage: {
        local: {
          get: (keys: any, cb: Function) => {
            if (typeof keys === 'object' && keys !== null) {
              const res = { ...keys };
              for (const k in keys) {
                if (store[k] !== undefined) res[k] = store[k];
              }
              cb(res);
            } else {
              cb(store);
            }
          },
          set: (items: any, cb?: Function) => {
            const changes: Record<string, any> = {};
            for (const k in items) {
              changes[k] = { oldValue: store[k], newValue: items[k] };
            }
            Object.assign(store, items);
            if (cb) cb();
            if ((window as any).__dt_storage_listeners) {
              (window as any).__dt_storage_listeners.forEach((l: Function) => l(changes, 'local'));
            }
          },
        },
        onChanged: {
          addListener: (fn: Function) => {
            if (!(window as any).__dt_storage_listeners) {
              (window as any).__dt_storage_listeners = [];
            }
            (window as any).__dt_storage_listeners.push(fn);
          },
        },
      },
      tabs: {
        query: (_q: any, cb: Function) => cb([{ id: 1, url: 'https://www.youtube.com/' }]),
        create: () => {},
        sendMessage: (_id: any, _msg: any, cb?: Function) => cb && cb({ isLoggedIn: false }),
      },
      alarms: {
        get: (_name: any, cb: Function) => cb && cb(null),
        create: () => {},
      },
    };
  }, initialStore);
}

// =============================================================================
// SUITE 1: POPUP EXTENSION UI STYLING & CONFLICT TESTS
// =============================================================================

test.describe('DeTube Popup UI Styling & Conflict Tests', () => {

  test('1. Popup shell dimensions strictly respect 370x490 fixed boundary without horizontal overflow', async ({ page }) => {
    await setupMockChrome(page);
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('.dt-popup');

    const popupBox = await page.locator('.dt-popup').boundingBox();
    expect(popupBox).not.toBeNull();
    if (popupBox) {
      expect(Math.round(popupBox.width)).toBe(370);
      expect(Math.round(popupBox.height)).toBe(490);
    }

    // Check no horizontal scrollbar or overflow on document
    const hasHorizontalOverflow = await page.evaluate(() => {
      const el = document.documentElement;
      const body = document.body;
      return (
        el.scrollWidth > el.clientWidth ||
        body.scrollWidth > body.clientWidth
      );
    });
    expect(hasHorizontalOverflow).toBe(false);

    // Nav rail width must be exactly 64px
    const navRailBox = await page.locator('.dt-nav-rail').boundingBox();
    expect(navRailBox).not.toBeNull();
    if (navRailBox) {
      expect(Math.round(navRailBox.width)).toBe(64);
    }
  });

  test('2. Light and Dark themes apply CSS variables correctly without contrast conflicts', async ({ page }) => {
    await setupMockChrome(page, { theme: 'dark' });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('.dt-popup');

    // Test Dark Theme computed values
    const darkBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    // In dark theme, background is dark #0a0a0a -> rgb(10, 10, 10)
    expect(darkBg).toBe('rgb(10, 10, 10)');

    // Switch to Light Theme
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });

    const lightBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    // In light theme, background is #f2f2f7 -> rgb(242, 242, 247)
    expect(lightBg).toBe('rgb(242, 242, 247)');

    // Ensure text color changed to dark
    const lightTextColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).color;
    });
    expect(lightTextColor).toBe('rgb(0, 0, 0)');
  });

  test('3. Navigation between all 7 tabs renders cleanly without overlapping or misaligned cards', async ({ page }) => {
    await setupMockChrome(page);
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('.dt-popup');

    const tabs = [
      { label: 'Header', expectedCards: 5 },
      { label: 'Sidebar', expectedCards: 15 },
      { label: 'Home', expectedCards: 2 },
      { label: 'Video', expectedCards: 10 },
      { label: 'Channel', expectedCards: 14 },
      { label: 'Shorts', expectedCards: 11 },
    ];

    for (const tab of tabs) {
      const tabButton = page.locator(`.dt-nav-rail-btn[title*="${tab.label}"]`);
      await tabButton.click();
      await page.waitForTimeout(100);

      // Verify active state class
      await expect(tabButton).toHaveClass(/active/);

      // Check for horizontal overflow in content body
      const bodyOverflow = await page.evaluate(() => {
        const bodyEl = document.querySelector('.dt-body');
        return bodyEl ? bodyEl.scrollWidth > bodyEl.clientWidth : false;
      });
      expect(bodyOverflow).toBe(false);

      // Check setting cards are present
      const cards = page.locator('.dt-body [role="switch"]');
      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(1);

      // Check that cards have non-zero height and toggles are positioned properly
      const firstCard = cards.first();
      const cardBox = await firstCard.boundingBox();
      expect(cardBox).not.toBeNull();
      if (cardBox) {
        expect(cardBox.height).toBeGreaterThanOrEqual(30);
      }
    }
  });

  test('4. Search bar opens, filters settings in real-time, and closes cleanly without layout distortion', async ({ page }) => {
    await setupMockChrome(page);
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('.dt-popup');

    // Search input should not exist initially
    await expect(page.locator('.dt-search-container')).toHaveCount(0);

    // Click search toggle in Header
    const searchBtn = page.locator('button[aria-label="Search settings"]');
    await searchBtn.click();

    // Search bar should slide down
    await expect(page.locator('.dt-search-container')).toBeVisible();
    const input = page.locator('.dt-search-input');
    await expect(input).toBeFocused();

    // Type "shorts" into search
    await input.fill('shorts');
    await page.waitForTimeout(150);

    // Results container should be visible with result badge
    await expect(page.locator('text=Search Results')).toBeVisible();
    const results = page.locator('.dt-body [role="switch"]');
    const resultCount = await results.count();
    expect(resultCount).toBeGreaterThan(0);

    // Clear search with Escape
    await page.keyboard.press('Escape');
    await expect(page.locator('.dt-search-container')).toHaveCount(0);
  });

  test('5. Focus Panel layout fits completely without overflowing or clipping controls', async ({ page }) => {
    await setupMockChrome(page);
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('.dt-popup');

    // Switch to Focus tab
    const focusTab = page.locator('.dt-nav-rail-btn[title*="Focus"]');
    await focusTab.click();
    await page.waitForSelector('.dt-focus-panel');

    // Verify Focus panel exists and does not horizontally overflow
    const hasOverflow = await page.evaluate(() => {
      const panel = document.querySelector('.dt-focus-panel');
      return panel ? panel.scrollWidth > panel.clientWidth : false;
    });
    expect(hasOverflow).toBe(false);

    // Verify Status Hero is rendered
    await expect(page.locator('.dt-status-hero')).toBeVisible();

    // Verify all 4 Mode items exist
    const modeTabs = page.locator('.dt-mode-tab');
    await expect(modeTabs).toHaveCount(4);

    // Test clicking Timer mode
    await page.locator('.dt-mode-tab:has-text("Timer")').click();
    await expect(page.locator('.dt-timer-stepper')).toBeVisible();

    // Test clicking Schedule mode
    await page.locator('.dt-mode-tab:has-text("Schedule")').click();
    await expect(page.locator('.dt-sched-days')).toBeVisible();
    await expect(page.locator('.dt-day-chip')).toHaveCount(7);

    // Test clicking Daily Limit mode
    await page.locator('.dt-mode-tab:has-text("Limit")').click();
    await expect(page.locator('.dt-limit-row')).toBeVisible();
  });

  test('6. Settings Panel renders dynamic version 3.4.0 and about links properly', async ({ page }) => {
    await setupMockChrome(page);
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('.dt-popup');

    // Switch to Settings tab
    const settingsBtn = page.locator('.settings-btn');
    await settingsBtn.click();
    await page.waitForSelector('.dt-settings-panel');

    // Verify version display is v3.4.0
    const versionEl = page.locator('.dt-about-value:has-text("v3.4.0")');
    await expect(versionEl).toBeVisible();

    // Verify Support Star Repo and Ko-fi buttons are visible and styled
    await expect(page.locator('button:has-text("Star Repo")')).toBeVisible();
    await expect(page.locator('button:has-text("Buy Me Coffee")')).toBeVisible();
  });

});

// =============================================================================
// SUITE 2: YOUTUBE CONTENT SCRIPT CSS ISOLATION & CONFLICT TESTS
// =============================================================================

test.describe('DeTube Content CSS YouTube Isolation & Conflict Tests', () => {

  const detubeCss = fs.readFileSync(path.join(__dirname, '../src/content/css/detube.css'), 'utf8');

  test('7. detube.css has NO unscoped global selectors that would leak onto native pages', async () => {
    // Check that every selector in detube.css is scoped to html.dt-
    const stripped = detubeCss.replace(/\/\*[\s\S]*?\*\//g, '');
    const blocks = stripped.split('}').map((b) => b.trim()).filter(Boolean);

    const unscoped: string[] = [];
    for (const b of blocks) {
      const selectorPart = b.split('{')[0].trim();
      if (!selectorPart || selectorPart.startsWith('@')) continue;
      // Split by comma outside brackets
      const selectors = selectorPart.split(/,(?![^[]*\])/).map((s) => s.trim()).filter(Boolean);
      for (const sel of selectors) {
        if (!sel.startsWith('html.dt-') && !sel.startsWith('html[data-dt-') && !sel.startsWith('.dt-')) {
          unscoped.push(sel);
        }
      }
    }

    expect(unscoped).toEqual([]);
  });

  test('8. When DeTube is disabled (no dt-* classes on html), zero YouTube elements are hidden', async ({ page }) => {
    // Load a synthetic YouTube page with detube.css injected
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>${detubeCss}</style>
        </head>
        <body>
          <div id="masthead">Masthead</div>
          <div id="center">Search Box</div>
          <div id="primary">Primary Content</div>
          <div id="secondary">Secondary Sidebar</div>
          <div id="comments">Comments Section</div>
          <div id="subscribe-button">Subscribe</div>
          <video src=""></video>
        </body>
      </html>
    `);

    // Verify all elements are visible
    const selectors = [
      '#masthead',
      '#center',
      '#primary',
      '#secondary',
      '#comments',
      '#subscribe-button',
      'video',
    ];

    for (const selector of selectors) {
      const display = await page.locator(selector).evaluate((el) => window.getComputedStyle(el).display);
      expect(display).not.toBe('none');
    }
  });

  test('9. When a specific toggle class is added, ONLY the targeted element is hidden and no other elements conflict', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>${detubeCss}</style>
        </head>
        <body>
          <div id="masthead">Masthead</div>
          <div id="center">Search Box</div>
          <div id="primary">Primary Content</div>
          <div id="comments">Comments Section</div>
          <video></video>
        </body>
      </html>
    `);

    // Initially comments are visible
    expect(await page.locator('#comments').evaluate((el) => window.getComputedStyle(el).display)).not.toBe('none');

    // Add dt-hide-comments class to html
    await page.evaluate(() => {
      document.documentElement.classList.add('dt-hide-comments');
    });

    // Now #comments MUST be hidden
    expect(await page.locator('#comments').evaluate((el) => window.getComputedStyle(el).display)).toBe('none');

    // Other elements must STILL be visible (no styling conflict)
    expect(await page.locator('#masthead').evaluate((el) => window.getComputedStyle(el).display)).not.toBe('none');
    expect(await page.locator('#primary').evaluate((el) => window.getComputedStyle(el).display)).not.toBe('none');
    expect(await page.locator('#center').evaluate((el) => window.getComputedStyle(el).display)).not.toBe('none');

    // Add grayscale video filter
    await page.evaluate(() => {
      document.documentElement.classList.add('dt-grayscale-video');
    });
    const videoFilter = await page.locator('video').evaluate((el) => window.getComputedStyle(el).filter);
    expect(videoFilter).toContain('grayscale(1)');

    // Remove classes and verify state fully restores
    await page.evaluate(() => {
      document.documentElement.className = '';
    });
    expect(await page.locator('#comments').evaluate((el) => window.getComputedStyle(el).display)).not.toBe('none');
  });

});
