---
name: project-detube-overview
description: DeTube Chrome/Firefox/Edge/Safari/Opera extension — tech stack, architecture, key constraints, and feature status
metadata:
  type: project
---

# DeTube Extension — Project Overview

## Tech Stack
- React 18.3, Vite 6, TypeScript 5.7, Tailwind 3.4, lucide-react 0.460
- Builds to 5 browsers: chrome, firefox, edge, safari, opera
- Popup: 370×490px, fixed dimensions

## Architecture
- `src/lib/config.ts` — single source of truth for all 50+ setting toggles (add entries here only)
- `src/lib/storage.ts` — ALL shared logic: `DeTubeStorage` (settings), `DeTubeTheme`, `DeTubeFocus` (focus/timer/schedule/daily-limit), `DeTubeStats`
- `src/background/index.ts` — badge management, `chrome.alarms` tick every 1 min, mode auto-logic
- `src/content/index.ts` — CSS class toggling on `<html>`, usage time reporting every 30s
- `src/popup/` — React popup with NavRail (7 tabs + Settings)

## Critical Build Constraint
Vite produces a single shared chunk `storage.js`. A custom post-build step in `vite.config.ts` IIFE-wraps it and inlines it into `content.js` and `background.js` (required for MV3 service workers and content scripts). **Never create a second shared lib file** — only `storage.ts` can be the shared module. All new shared code must go in `storage.ts`.

## Navigation Tabs
Header, Sidebar, Home, Video, Channel, Shorts, **Focus** (Target icon), + Settings gear at bottom.

## Focus Features (added 2026-05-22, branch feature/added-shorts-and-new-UI-redsign)
- **Always Block**: permanent toggle (existing `enabled` flag, formalized as a mode)
- **Focus Timer**: user picks 30m/1h/2h/custom → sets `timerEndTime` in storage → background auto-disables on expiry; popup shows live countdown; badge shows remaining time (e.g., "42m")
- **Schedule**: Mon–Fri / custom days + start/end time → background tick enables/disables `enabled` every minute based on schedule
- **Daily Limit**: content script reports 30s usage every 30 seconds → background accumulates `dailyUsedSeconds`; auto-disables when limit reached; popup shows progress bar
- **Stats**: focus minutes today/total, streak days, session count — tracked by background tick and stored in `focusStats` key

## Permissions (all manifests)
`storage`, `scripting`, `tabs`, `alarms`

## Storage Keys
- `enabled` (boolean) — master on/off
- `<settingKey>` (boolean × 50+) — individual toggles
- `theme` — 'system' | 'light' | 'dark'
- `focusConfig` (FocusConfig) — blocking mode, timer end time, schedule config, daily limit
- `focusStats` (FocusStats) — streak, session count, focus minutes today/total
