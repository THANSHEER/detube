# DeTube — Agent Reference

> **For AI agents and future developers.** This document is the canonical reference for the DeTube extension architecture. Read this before touching any code.

---

## Project Overview

**DeTube** is an open-source browser extension that provides distraction-free YouTube by letting users hide individual UI elements. It supports Chrome (MV3), Firefox (MV3), Edge, Safari (MV3), Arc, and Brave.

- **Repo:** [github.com/THANSHEER/detube](https://github.com/THANSHEER/detube)
- **By:** [GeekStash.dev](https://geekstash.dev)

---

## Architecture: Single Source of Truth

**The entire extension is driven by one file: `src/lib/config.ts`.**

Every setting (hide search, hide comments, etc.) is defined as a `SettingDefinition` object in the `SETTING_REGISTRY` array. All other modules derive from it:

| Module                         | Derives from config                                      |
| ------------------------------ | -------------------------------------------------------- |
| `src/lib/storage.ts`           | `Settings` type + `DEFAULTS` object                      |
| `src/content/index.ts`         | `SETTING_TO_CSS_CLASS` map → which class to toggle       |
| `src/popup/App.tsx`            | Renders all cards/sections by looping `SETTING_REGISTRY` |
| `scripts/validate-settings.js` | Verifies 59/59 settings have CSS rules                   |
| `manifest.edge.json`           | Microsoft Edge Manifest (derives from Chrome)            |
| `manifest.safari.json`         | Safari Manifest (MV3)                                    |

### Adding a new setting — 2 steps only:

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
│   │   ├── config.ts          ← SINGLE SOURCE OF TRUTH (59 settings)
│   │   └── storage.ts         ← Storage API (derives from config)
│   ├── content/
│   │   ├── index.ts           ← Content script (imports from lib/)
│   │   └── css/
│   │       ├── detube.css     ← Combined output (DO NOT EDIT directly)
│   │       └── selectors/     ← Source CSS files (edit these)
│   ├── background/
│   │   └── index.ts           ← Service worker + onInstalled injection
│   ├── popup/
│   │   └── App.tsx            ← Data-driven popup (loops config registry)
│   ├── components/
│   │   ├── Header.tsx         ← Title, GitHub icon, master toggle
│   │   ├── TabNavigation.tsx  ← 5-tab nav (Header/Sidebar/Home/Video/Channel)
│   │   ├── SettingCard.tsx    ← Individual setting row with toggle
│   │   ├── SectionDivider.tsx ← Section labels
│   │   └── Footer.tsx         ← GEEKSTASH.DEV footer link
│   └── styles/
│       └── global.css         ← Browser-native design tokens + layout
├── scripts/
│   ├── build-css.js           ← Concatenates selectors/ → detube.css
│   ├── validate-settings.js   ← Checks 59 settings have CSS rules
│   ├── validate-css.js        ← Checks CSS syntax and selectors
│   ├── test-css-rules.js      ← Pattern-tests key CSS selectors
│   ├── verify-build.js        ← Checks dist files are all present
│   └── zip-builds.js          ← Zips dist-chrome and dist-firefox
├── manifest.chrome.json       ← Chrome/Arc/Brave manifest
├── manifest.firefox.json      ← Firefox manifest
├── manifest.edge.json         ← Microsoft Edge manifest
├── manifest.safari.json       ← Safari manifest
├── tailwind.config.js         ← Uses CSS var tokens (--dt-*)
└── vite.config.ts             ← Build config + IIFE inlining for content scripts
```

---

## Build System

```bash
node scripts/build-css.js                          # Rebuild detube.css
TARGET_BROWSER=chrome node node_modules/.bin/vite build   # Build Chrome
TARGET_BROWSER=firefox node node_modules/.bin/vite build  # Build Firefox
TARGET_BROWSER=safari node node_modules/.bin/vite build   # Build Safari
```

**Why not `npm run build`?** The `npm` symlink in this nvm installation is broken. Use the direct `node node_modules/.bin/vite` invocation instead.

### Critical: IIFE inlining (vite.config.ts)

Vite code-splits shared modules into `storage.js`. Content scripts and service workers **cannot** use ES module `import` statements. The `vite.config.ts` `closeBundle` hook:

1. Reads `storage.js` after build
2. Wraps it in an IIFE: `var __dt__=(function(){...return{exports}})();`
3. Replaces `import{X as Y}from"./storage.js"` in `content.js` and `background.js` with `var Y=__dt__.X`
4. **Keeps `storage.js`** — the popup (loaded via `index.html` as a proper ES module) still needs it

---

## Design System

The UI uses browser-native CSS custom properties defined in `global.css`:

| Token                               | Purpose                                      |
| ----------------------------------- | -------------------------------------------- |
| `--dt-accent`                       | Brand indigo (light: #6366f1, dark: #818cf8) |
| `--dt-surface`                      | Popup background                             |
| `--dt-surface-raised`               | Cards / tab bar background                   |
| `--dt-border`                       | Subtle borders                               |
| `--dt-text-primary/secondary/muted` | Text hierarchy                               |
| `--dt-toggle-off/thumb`             | Toggle colours                               |
| `--dt-radius/sm/lg`                 | Border radii                                 |

Dark/light mode is handled entirely by `@media (prefers-color-scheme: dark)` — no JS needed.

The popup layout uses three fixed zones:

- `.dt-header-area` — fixed top (header + tab nav)
- `.dt-body` — scrollable middle (settings list)
- `.dt-footer-area` — fixed bottom (GEEKSTASH.DEV)

---

## Permissions

| Permission  | Why                                                                    |
| ----------- | ---------------------------------------------------------------------- |
| `storage`   | Save user settings                                                     |
| `scripting` | Inject content script into already-open YouTube tabs on install/update |
| `tabs`      | Query current tab URL to auto-switch popup tab                         |

---

## Known Gotchas

1. **npm is broken** — use `node node_modules/.bin/<tool>` directly
2. **storage.js must not be deleted** — popup.js imports from it
3. **content.js must not use ES imports** — IIFE inlining handles this
4. **build-css.js must run before vite** — otherwise `detube.css` will be stale
5. **Firefox requires `browser_specific_settings.gecko`** — already in `manifest.firefox.json`
6. **Safari MV3 support** — requires modern Safari (15.4+) and `host_permissions` for auto-injection
7. **`run_at: document_start`** is set in manifests — the content script runs before DOM loads; settings are applied once DOM is ready

---

## Validation

Run all checks before committing:

```bash
node scripts/validate-css.js        # CSS syntax + selectors
node scripts/validate-settings.js   # All 59 settings have CSS rules
node scripts/test-css-rules.js      # 35/35 pattern tests
node scripts/verify-build.js        # Build output completeness
```

Expected: all pass with 0 failures.

---

## Content Script Logic

`src/content/index.ts` uses a `DeTubeEngine` class:

- `init()` — loads settings from storage, calls `applyAll()`, subscribes to changes
- `applyAll()` — batch-toggles `dt-*` CSS classes on `<html>` based on settings
- `scheduleApply()` — debounces via `requestAnimationFrame` to coalesce rapid changes
- `observe()` — watches for:
  - YouTube stripping classes (re-applies them)
  - DOM mutations (YouTube dynamically loads content)
  - `yt-navigate-finish` event (YouTube SPA navigation)

---

## Background Script

`src/background/index.ts`:

- Sets badge text: **ON** (indigo) / **OFF** (red)
- On `chrome.runtime.onInstalled`: injects CSS then JS into all open YouTube tabs so users don't need to refresh after install

---

_Last updated: 2026-05-05 — Refactoring v1 complete_
