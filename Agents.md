# DeTube — Agent Reference

> **For AI agents and future developers.** Canonical reference for architecture, constraints, and memory. Read this before touching any code.

---

## Project Overview

**DeTube** is an open-source browser extension that provides distraction-free YouTube by letting users hide individual UI elements. It supports Chrome (MV3), Firefox (MV3), Edge, Safari (MV3), Arc, Brave, and Opera.

- **Version:** 3.0.0
- **Repo:** [github.com/THANSHEER/detube](https://github.com/THANSHEER/detube)
- **By:** [GeekStash.dev](https://geekstash.dev)
- **Popup size:** 370×490px fixed

## Tech Stack

| Layer | Library / Tool |
| ----- | -------------- |
| UI | React 18.3, lucide-react 0.460 |
| Build | Vite 6, TypeScript 5.7 |
| Styles | Tailwind 3.4 + CSS custom properties (`--dt-*`) |
| Targets | chrome, firefox, edge, safari, opera (5 builds) |

---

## Architecture: Single Source of Truth

**The entire extension is driven by one file: `src/lib/config.ts`.**

Every setting (hide search, hide comments, etc.) is defined as a `SettingDefinition` object in the `SETTING_REGISTRY` array. All other modules derive from it:

| Module | Derives from config |
| ------ | ------------------- |
| `src/lib/storage.ts` | `Settings` type + `DEFAULTS` object |
| `src/content/index.ts` | `SETTING_TO_CSS_CLASS` map → which class to toggle |
| `src/popup/App.tsx` | Renders all cards/sections by looping `SETTING_REGISTRY` |
| `scripts/validate-settings.js` | Verifies all settings have CSS rules |

### Adding a new setting — 3 steps only

1. Add one `SettingDefinition` entry to `SETTING_REGISTRY` in `src/lib/config.ts`
2. Add the CSS rule in the appropriate `src/content/css/selectors/*.css` file
3. Run `npm run build:css` to regenerate `detube.css`

No other file changes needed.

---

## File Structure

```
detube/
├── src/
│   ├── lib/
│   │   ├── config.ts          ← SINGLE SOURCE OF TRUTH (50+ settings)
│   │   └── storage.ts         ← Storage API: DeTubeStorage, DeTubeTheme,
│   │                             DeTubeFocus (timer/schedule/daily-limit),
│   │                             DeTubeStats — ALL shared logic lives here
│   ├── content/
│   │   ├── index.ts           ← Content script (CSS class toggling on <html>)
│   │   └── css/
│   │       ├── detube.css     ← Combined output (DO NOT EDIT directly)
│   │       └── selectors/     ← Source CSS files (edit these)
│   ├── background/
│   │   └── index.ts           ← Service worker: badge, alarms tick (1 min),
│   │                             auto-enable/disable for schedule/timer/daily-limit
│   ├── popup/
│   │   └── App.tsx            ← Data-driven popup (loops config registry)
│   ├── components/
│   │   ├── Header.tsx         ← Title bar, GitHub icon, master power toggle
│   │   ├── NavRail.tsx        ← 7-tab nav (Header/Sidebar/Home/Video/Channel/Shorts/Focus) + Settings
│   │   ├── SettingCard.tsx    ← Individual setting row with toggle
│   │   ├── SectionDivider.tsx ← Section labels (white text)
│   │   ├── SettingsPanel.tsx  ← Appearance, Browser, About panel
│   │   └── FocusPanel.tsx     ← Focus mode controls (timer/schedule/daily-limit)
│   └── styles/
│       └── global.css         ← CSS custom properties + layout
├── scripts/
│   ├── build-css.js           ← Concatenates selectors/ → detube.css
│   ├── validate-settings.js   ← Checks all settings have CSS rules
│   ├── validate-css.js        ← Checks CSS syntax and selectors
│   ├── test-css-rules.js      ← Pattern-tests key CSS selectors
│   ├── verify-build.js        ← Checks dist files are all present
│   └── zip-builds.js          ← Zips dist-* folders
├── public/
│   ├── icon.svg               ← Master icon (screen + play + slider mark)
│   └── icons/
│       ├── icon16.png         ← Exported from icon.svg
│       ├── icon32.png
│       ├── icon48.png
│       └── icon128.png
├── manifest.chrome.json       ← Chrome/Arc/Brave manifest
├── manifest.firefox.json      ← Firefox manifest (includes gecko settings)
├── manifest.edge.json         ← Microsoft Edge manifest
├── manifest.safari.json       ← Safari manifest (MV3)
├── manifest.opera.json        ← Opera manifest
├── tailwind.config.js         ← Uses CSS var tokens (--dt-*)
└── vite.config.ts             ← Build config + IIFE inlining for content scripts
```

---

## Build System

```bash
node scripts/build-css.js                                    # Rebuild detube.css
TARGET_BROWSER=chrome node node_modules/.bin/vite build      # Build Chrome
TARGET_BROWSER=firefox node node_modules/.bin/vite build     # Build Firefox
TARGET_BROWSER=safari node node_modules/.bin/vite build      # Build Safari
```

> **Why not `npm run build`?** The `npm` symlink in this nvm installation is broken. Use `node node_modules/.bin/vite` directly.

### Critical: IIFE inlining (`vite.config.ts`)

Vite code-splits shared modules into `storage.js`. Content scripts and service workers **cannot** use ES module `import` statements. The `vite.config.ts` `closeBundle` hook:

1. Reads `storage.js` after build
2. Wraps it in an IIFE: `var __dt__=(function(){...return{exports}})();`
3. Replaces `import{X as Y}from"./storage.js"` in `content.js` and `background.js` with `var Y=__dt__.X`
4. **Keeps `storage.js`** — the popup (loaded via `index.html` as a proper ES module) still needs it

**Never create a second shared lib file** — only `storage.ts` can be the shared module. All new shared logic must go in `storage.ts`.

---

## Design System

CSS custom properties defined in `src/styles/global.css`:

| Token | Purpose |
| ----- | ------- |
| `--dt-accent` | Brand red (`#ff0000`) |
| `--dt-gradient` | `linear-gradient(135deg, #ff2020 0%, #cc0000 100%)` |
| `--dt-surface` | Popup background (`#0f0f0f` dark / `#fafafa` light) |
| `--dt-surface-raised` | Cards / tab bar background |
| `--dt-border` | Subtle borders |
| `--dt-text-primary/secondary/muted` | Text hierarchy |
| `--dt-radius/sm/lg` | Border radii (12px / 8px / 16px) |

Dark/light mode via `@media (prefers-color-scheme: dark)` — no JS needed.

Popup layout uses three fixed zones:
- `.dt-header-area` — fixed top (header + nav rail)
- `.dt-body` — scrollable middle (settings list)
- `.dt-footer-area` — fixed bottom

---

## Navigation Tabs

Header, Sidebar, Home, Video, Channel, Shorts, **Focus** (Target icon), + Settings gear at bottom.

---

## Focus Features (added v3.0.0, branch `feature/added-shorts-and-new-UI-redsign`)

Controlled via `DeTubeFocus` in `storage.ts` and `FocusPanel.tsx`:

| Mode | Behaviour |
| ---- | --------- |
| **Always Block** | Permanent toggle — existing `enabled` flag, formalized as a mode |
| **Focus Timer** | User picks 30m/1h/2h/custom → sets `timerEndTime` → background auto-disables on expiry; popup shows live countdown |
| **Schedule** | Mon–Fri / custom days + start/end time → background tick (every 1 min) enables/disables `enabled` |
| **Daily Limit** | Content script reports 30s usage every 30 seconds → background accumulates `dailyUsedSeconds`; auto-disables when limit hit; popup shows progress bar |
| **Stats** | Focus minutes today/total, streak days, session count — tracked by background tick, stored in `focusStats` key |

Badge behavior: shows timer/limit countdown text when active; blank for simple ON/OFF states (color only).

---

## Storage Keys

| Key | Type | Purpose |
| --- | ---- | ------- |
| `enabled` | boolean | Master on/off |
| `<settingKey>` | boolean × 50+ | Individual toggles |
| `theme` | `'system' \| 'light' \| 'dark'` | Appearance |
| `focusConfig` | `FocusConfig` | Blocking mode, timer end time, schedule config, daily limit |
| `focusStats` | `FocusStats` | Streak, session count, focus minutes today/total |

---

## Permissions

| Permission | Why |
| ---------- | --- |
| `storage` | Save user settings |
| `scripting` | Inject content script into already-open YouTube tabs on install/update |
| `tabs` | Query current tab URL to auto-switch popup tab |
| `alarms` | 1-minute tick for timer/schedule/daily-limit auto-logic |

---

## Content Script Logic

`src/content/index.ts` — `DeTubeEngine` class:

- `init()` — loads settings from storage, calls `applyAll()`, subscribes to changes
- `applyAll()` — batch-toggles `dt-*` CSS classes on `<html>` based on settings
- `scheduleApply()` — debounces via `requestAnimationFrame` to coalesce rapid changes
- `observe()` — watches for YouTube stripping classes, DOM mutations, and `yt-navigate-finish` events

Usage time: reported every 30 seconds to background via `addUsageTime` message (feeds daily-limit counter).

---

## Background Script

`src/background/index.ts`:

- Badge: color indicates status (indigo = active, grey = inactive); text shows remaining time only for timer/daily-limit modes — no "ON"/"OFF" text
- On `chrome.runtime.onInstalled`: injects CSS then JS into all open YouTube tabs so users don't need to refresh
- Alarm `detube-tick` fires every 1 minute: handles timer expiry, schedule enable/disable, daily-limit accumulation, stats recording

---

## Known Gotchas

1. **npm is broken** in this nvm setup — use `node node_modules/.bin/<tool>` directly
2. **`storage.js` must not be deleted** — popup.js imports from it as an ES module
3. **content.js must not use ES imports** — IIFE inlining handles this at build time
4. **`build-css.js` must run before vite** — otherwise `detube.css` will be stale
5. **Firefox requires `browser_specific_settings.gecko`** — already in `manifest.firefox.json`
6. **Safari MV3** — requires Safari 15.4+ and `host_permissions` for auto-injection
7. **`run_at: document_start`** — content script runs before DOM loads; settings applied once DOM is ready

---

## Validation

Run all checks before committing:

```bash
node scripts/validate-css.js        # CSS syntax + selectors
node scripts/validate-settings.js   # All settings have CSS rules
node scripts/test-css-rules.js      # Pattern tests
node scripts/verify-build.js        # Build output completeness
```

Expected: all pass with 0 failures.

---

## Icon Export

Master SVG: `public/icon.svg` (screen + play triangle + control slider mark).
To regenerate PNGs after changing the SVG (macOS):

```bash
qlmanage -t -s 512 -o /tmp/ public/icon.svg
for size in 16 32 48 128; do
  sips -z $size $size /tmp/icon.svg.png --out public/icons/icon${size}.png
done
```

_Last updated: 2026-05-23 — v3.0.0_
