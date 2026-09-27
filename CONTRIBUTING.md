<div align="center">
  <h1>🤝 Contributing to DeTube</h1>
  <p>Thank you for considering contributing to DeTube! This guide provides everything you need to know about developing, building for all supported browsers, adding new settings, and submitting your changes.</p>
</div>

---

## 📋 Table of Contents

1. [Prerequisites & Local Setup](#-1-prerequisites--local-setup)
2. [Browser Build & Loading Guide](#-2-browser-build--loading-guide)
   - [Chrome / Arc / Brave](#-chrome--arc--brave)
   - [Firefox](#-firefox)
   - [Microsoft Edge](#-microsoft-edge)
   - [Opera](#-opera)
   - [Apple Safari (macOS)](#-apple-safari-macos)
3. [Architecture: Single Source of Truth](#-3-architecture-single-source-of-truth)
4. [How to Add a New Setting (3 Steps)](#-4-how-to-add-a-new-setting-3-steps)
5. [Development & Watch Mode](#-5-development--watch-mode)
6. [Testing & Validation](#-6-testing--validation)
7. [Submitting a Pull Request](#-7-submitting-a-pull-request)

---

## 🚀 1. Prerequisites & Local Setup

### System Requirements
- **Node.js**: `v22.0.0` or higher
- **npm**: `v10.0.0` or higher (or `npx` / `node`)
- **Git**
- **Xcode 14+** *(only required if developing/testing for Apple Safari on macOS)*

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/THANSHEER/detube.git
cd detube

# 2. Install dependencies
npm install

# 3. Generate the combined CSS selectors
node scripts/build-css.js

# 4. Build for your browser of choice (e.g. Chrome)
TARGET_BROWSER=chrome node node_modules/.bin/vite build
```

The compiled extension will be placed in a browser-specific folder (e.g., `dist-chrome/`, `dist-firefox/`, `dist-safari/`, `dist-edge/`, `dist-opera/`).

---

## 🌐 2. Browser Build & Loading Guide

DeTube is built with **Manifest V3** and supports all major modern browsers. Select your browser below for exact build and installation instructions:

### 🟡 Chrome / Arc / Brave

```bash
# Build Chrome target
node scripts/build-css.js
TARGET_BROWSER=chrome node node_modules/.bin/vite build
```

**How to load in Chrome / Arc / Brave:**
1. Open your browser and navigate to the extensions page:
   - **Chrome**: `chrome://extensions/`
   - **Brave**: `brave://extensions/`
   - **Arc**: `arc://extensions/`
2. Enable **Developer mode** toggle in the top-right corner.
3. Click **Load unpacked** (top-left).
4. Select the `dist-chrome` folder inside your repository.
5. DeTube is now active. Open [YouTube](https://www.youtube.com) to test your changes.

---

### 🟠 Firefox

```bash
# Build Firefox target (automatically applies AMO sanitization)
node scripts/build-css.js
TARGET_BROWSER=firefox node node_modules/.bin/vite build
```

**How to load in Firefox:**
1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Select `dist-firefox/manifest.json`.
4. The extension will remain loaded until Firefox restarts.

> [!NOTE]
> Firefox requires `browser_specific_settings.gecko` in the manifest and strict DOM sanitization. Our Vite build automatically handles AMO compliance during the bundle step.

---

### 🔵 Microsoft Edge

```bash
# Build Edge target
node scripts/build-css.js
TARGET_BROWSER=edge node node_modules/.bin/vite build
```

**How to load in Edge:**
1. Open Edge and navigate to `edge://extensions/`.
2. Turn on the **Developer mode** toggle in the left sidebar.
3. Click **Load unpacked**.
4. Select the `dist-edge` directory.

---

### 🔴 Opera

```bash
# Build Opera target
node scripts/build-css.js
TARGET_BROWSER=opera node node_modules/.bin/vite build
```

**How to load in Opera:**
1. Open Opera and navigate to `opera://extensions`.
2. Turn on the **Developer mode** toggle in the top-right corner.
3. Click **Load unpacked**.
4. Select the `dist-opera` folder.

---

### 🍏 Apple Safari (macOS)

Safari extensions use Apple's native App Extension container. DeTube builds a Manifest V3 compliant bundle which is converted into an Xcode macOS application.

#### Prerequisites for Safari
- macOS 12 (Monterey) or higher
- **Xcode 14.0+** installed from the Mac App Store
- Xcode Command Line Tools installed (`xcode-select --install`)

#### Step-by-Step Safari Instructions

```bash
# 1. Build the core CSS and Safari bundle
node scripts/build-css.js
TARGET_BROWSER=safari node node_modules/.bin/vite build

# 2. Convert dist-safari into an Xcode project
xcrun safari-web-extension-converter dist-safari/ \
  --project-location ./safari-xcode \
  --app-name "DeTube" \
  --bundle-identifier dev.geekstash.detube \
  --macos-only \
  --no-open
```

#### Step 3: Enable Unsigned Extensions in Safari
Because local builds are not signed by the App Store, you must enable developer testing in Safari:
1. Open **Safari**.
2. Open Settings: press `⌘ ,` (or go to **Safari > Settings / Preferences** in the menu bar).
3. Go to the **Advanced** tab.
4. Check **Show features for web developers** (or **Show Develop menu in menu bar** on older macOS versions).
5. In the menu bar, open the new **Develop** menu and check **Allow Unsigned Extensions**.
6. Enter your Mac administrator password or Touch ID when prompted.

> [!IMPORTANT]
> Safari automatically unchecks "Allow Unsigned Extensions" when Safari quits. Remember to re-check it when testing.

#### Step 4: Run in Xcode
1. Open the generated project in Xcode:
   ```bash
   open safari-xcode/DeTube/DeTube.xcodeproj
   ```
2. In the Xcode toolbar, select the **DeTube (macOS)** target and destination **My Mac**.
3. Under the **Signing & Capabilities** tab:
   - Select your personal Apple ID or Development Team.
4. Click **Run** (`⌘ R`) or the Play button in Xcode.
5. The DeTube companion app window will launch. Click **Quit and Open Safari Settings...**.
6. In **Safari Settings > Extensions**:
   - Check the box next to **DeTube**.
   - Under Permissions, select **Always Allow on Every Website** (or configure for `youtube.com`).

---

## 🏛️ 3. Architecture: Single Source of Truth

**The entire extension is driven by one file: [`src/lib/config.ts`](src/lib/config.ts).**

Every element that can be hidden or configured is registered as a `SettingDefinition` object in the `SETTING_REGISTRY` array. All other parts of the extension automatically derive from this registry:

| Module | What It Derives |
| :--- | :--- |
| [`src/lib/storage.ts`](src/lib/storage.ts) | `Settings` TypeScript type + default values (`DEFAULTS`) |
| [`src/content/index.ts`](src/content/index.ts) | Class toggle map (`SETTING_TO_CSS_CLASS`) injected on `<html>` |
| [`src/popup/App.tsx`](src/popup/App.tsx) | Renders all cards, sections, categories, and search results |
| [`scripts/validate-settings.js`](scripts/validate-settings.js) | Automated validation ensuring every setting has corresponding CSS |

### Code Structure

```
detube/
├── src/
│   ├── lib/
│   │   ├── config.ts          ← SINGLE SOURCE OF TRUTH (all 70+ settings defined here)
│   │   └── storage.ts         ← Storage API (settings, theme, focus mode, stats)
│   ├── content/
│   │   ├── index.ts           ← Content script (batch-toggles dt-* classes on <html>)
│   │   └── css/
│   │       ├── detube.css     ← Combined output (DO NOT EDIT directly)
│   │       └── selectors/     ← Source CSS selector files (edit these!)
│   ├── background/
│   │   └── index.ts           ← Service worker (1-min tick, timer expiry, schedule, badges)
│   ├── popup/
│   │   ├── main.tsx           ← React root
│   │   └── App.tsx            ← Main popup shell (header, search, navigation rail, body)
│   ├── components/            ← Reusable UI components (Header, NavRail, SettingCard, etc.)
│   └── styles/
│       └── global.css         ← Design system tokens (--dt-*) and popup styling
├── scripts/                   ← Build & validation scripts
└── vite.config.ts             ← Multi-browser build & IIFE inlining config
```

---

## ✨ 4. How to Add a New Setting (3 Steps)

Thanks to the single-source-of-truth architecture, adding a new toggle requires **only 3 steps**:

### Step 1: Add the definition to `src/lib/config.ts`
Add an entry to `SETTING_REGISTRY`:
```ts
{
  key: 'hideMyNewElement',
  cssClass: 'dt-hide-my-new-element',
  category: 'videopage',       // 'header' | 'sidebar' | 'homepage' | 'videopage' | 'channelpage' | 'shortspage'
  section: 'video-layout',     // SettingSection enum
  defaultValue: false,
  label: 'Hide My New Element',
  icon: 'EyeOff',              // Any Lucide icon name
}
```

### Step 2: Add the CSS rule
Open the matching CSS file in `src/content/css/selectors/` (e.g. `video-page.css`):
```css
html.dt-hide-my-new-element #my-element-selector {
  display: none !important;
}
```

### Step 3: Rebuild CSS
```bash
node scripts/build-css.js
```

That's it! The toggle will automatically appear in the popup UI, be searchable, save to browser storage, and apply to YouTube pages.

---

## ⚡ 5. Development & Watch Mode

For active development with auto-rebuilding upon saving:

```bash
# Watch Chrome build
npm run watch:chrome

# Watch Firefox build
npm run watch:firefox

# Watch Safari build
npm run watch:safari

# Watch Opera build
npm run watch:opera
```

Whenever you modify and save files, reload the unpacked extension in your browser to inspect the changes.

---

## 🧪 6. Testing & Validation

Before committing or opening a pull request, run the test suite to ensure all selectors, syntax, and types are valid:

```bash
# 1. Validate CSS syntax and YouTube selector integrity
node scripts/validate-css.js

# 2. Verify all settings in config.ts have CSS rules
node scripts/validate-settings.js

# 3. Test selector patterns and !important rules
node scripts/test-css-rules.js

# 4. Check TypeScript types
node node_modules/.bin/tsc --noEmit

# 5. Verify build outputs across all target browsers
node scripts/verify-build.js

# 6. Run Playwright end-to-end styling & conflict tests
npm run test:e2e
```

All tests should pass with **0 errors**.

---

## 🤝 7. Submitting a Pull Request

We welcome pull requests! To help us review your contribution smoothly:

1. **Create a descriptive branch**:
   ```bash
   git checkout -b feature/hide-comments-header
   # or
   git checkout -b fix/sidebar-button-alignment
   ```
2. **Commit with clear messages**: Follow standard conventional commits:
   - `feat: add toggle for miniplayer button`
   - `fix: update selector for new YouTube navigation bar`
   - `docs: update Safari setup instructions`
3. **Verify tests pass**: Run all test commands above before pushing.
4. **Open a Pull Request**: Provide a clear summary of what changed and reference any related issues.

---

<div align="center">
  <p><b>Thank you for helping make YouTube distraction-free for everyone! 🚀</b></p>
</div>
