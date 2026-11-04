# Changelog

All notable changes to this project will be documented in this file.

## [3.5.0] - 2026-11-04

### Features & Mobile Availability
- **Mobile Browser Availability**: DeTube is now optimized and available across mobile browsers including Firefox for Android (minimum version 115.0+), Microsoft Edge Android, Safari iOS, Orion, and Kiwi Browser.
- **Mobile Options UI**: Added `options_ui` manifest support across all browser builds (Chrome, Firefox, Edge, Safari, Opera), allowing the full settings interface to be accessed directly from mobile extension managers.
- **YouTube Mobile (`m.youtube.com`) Selectors**: Added dedicated mobile selector coverage across headers, video player pages, and Shorts feeds, with content script observation for mobile navigation events (`popstate`).
- **Reset to Defaults**: Added a one-click "Reset to Defaults" option with confirmation in the Settings panel for quick configuration resets.

### UI & Animation Polish
- **Smooth Startup & 0ms Hydration**: Synchronously hydratated theme and user toggles from local storage before initial paint, eliminating toggle flash (FOUC) and visual jumps.
- **Hardware-Accelerated Entrance**: Added smooth, GPU-accelerated popup opening animation (`dtPopupOpen`), tab enter transitions (`dtTabEnter`), and fluid spring physics on toggle switches.
- **Responsive & Safe Area Layout**: Upgraded popup viewport to `100dvh` with `viewport-fit=cover` and CSS safe-area insets (`env(safe-area-inset-*)`), delivering a native mobile app feel.
- **Touch Optimization**: Implemented `touch-action: manipulation`, suppressed touch highlights, and added hidden horizontal scrollbars on navigation rails for smooth touch swiping.
- **Dynamic Theme Color**: Configured browser toolbar `theme-color` meta tags matching system dark/light modes.

### Maintenance & Dead CSS Cleanup
- **Dead CSS Elimination**: Consolidated duplicated `html.dt-hide-subscribe` and `html.dt-hide-join-button` rules across `channel.css` and `video-page.css`, streamlining selector evaluation.
- **Toolchain Modernization**: Upgraded dependencies to latest stable versions:
  - React 19.3.1
  - Vite 8.3.5
  - TypeScript 7.0.2
  - Tailwind CSS 3.4.19 LTS
  - Lucide-React 1.68.0
  - Playwright 1.64.1 & updated `@types` packages
- **Dedicated Brand Icons**: Implemented lightweight, custom SVG icons for GitHub and YouTube to ensure future-proof stability.

## [3.4.0] - 2026-09-26

### Features
- **Quick Settings Search**: You can now search across all 70+ distraction-free settings instantly. Open the search bar anytime with the search button in the top bar or by pressing `/` (or `Cmd/Ctrl + K`) on your keyboard.
- **Active Filter Indicators**: The side navigation tabs and section headers now display counter badges showing exactly how many items you currently have hidden in each area.

### Performance & Improvements
- **Faster and Lighter**: Reduced extension bundle size and eliminated unnecessary background logging, making DeTube lighter on memory and faster to open.
- **Smoother Animations**: Refined UI animations and page transitions for an instantaneous, native-feeling experience.
- **Accurate Version Display**: The About section now automatically detects and displays the exact version installed.

### Fixes
- **Shorts Player Options**: Fixed an issue where hiding one button (like the Like or Remix button) would hide unrelated controls. Sub-settings now work independently and sit directly beneath their parent toggle.
- **Restored Missing Icons**: Fixed icons for Report History, Sidebar Footer, and Shorts Remix so they no longer show a generic gear icon.
- **Search Reliability**: Fixed search behavior when the extension is disabled and properly hid sign-in-only settings when logged out.
- **Background Stability**: Prevented background script errors when updating the extension with YouTube tabs already open.

## [3.3.0] - 2026-08-16

### Features
- **Ko-fi Support Button**: Optional Ko-fi button added to the settings panel so users can support DeTube's development

### Fixes
- Added the Ko-fi CDN to the extension's Content Security Policy so the Ko-fi widget loads correctly
- Simplified sidebar-hiding selectors, dropping redundant title-based matching for more reliable results

## [3.2.2] - 2026-08-12

### Features
- **Enhanced Privacy Documentation**: Comprehensive transparency about how feedback and bug reports are handled
- **Updated Privacy Policy**: New section explaining user-initiated bug reporting via GitHub
- **Uninstall Feedback Clarity**: Clear documentation about the uninstall feedback page

### Security
- All feedback and bug reporting remains completely voluntary and user-initiated
- Zero automatic data collection during uninstall
- Confirmed: no personal data transmission or storage
- YouTube activity data remains on-device only

## [3.2.1] - 2026-08-12

### Improvements
- Enhanced stability and reliability across all supported platforms
- Improved release management and documentation standards
- Added a comprehensive CHANGELOG.md covering the full release history

### Fixes
- Fixed version synchronization issues across Chrome, Firefox, Edge, Opera, and Safari manifests
- Resolved compatibility issues ensuring consistent behavior across all browsers

## [3.2.0] - 2026-06-28

### Features
- **Redesigned Settings Panel**: Cleaner layout with better organization of all options
- **Improved Visual Feedback**: Enhanced UI elements for better user interaction

### Improvements
- Refined styling and visual hierarchy throughout the extension
- Faster loading of settings and options
- Better organization of content filtering controls

## [3.1.0] - 2026-06-28

### Features
- **Hide YouTube Shorts**: New toggle to remove Shorts from the YouTube feed and recommendations
- **Restructured Settings**: Better-organized settings panel with clear feature grouping
- **Enhanced Controls**: Improved controls for managing what you see on YouTube

### Improvements
- Updated assets for better visual clarity
- Improved extension UI with refined design elements
- Streamlined feature organization for easier access

## [3.0.0] - 2026-05-08

### Features
- **Complete Settings Redesign**: Brand-new settings interface with improved layout and organization
- **New Configuration Options**: Additional controls for granular YouTube customization
- **Better User Experience**: Completely redesigned extension interface for easier navigation

### Improvements
- Modern visual design with updated styling
- Intuitive layout for finding and adjusting preferences
- Enhanced readability with improved typography and spacing

## [2.0.1] - 2026-05-08

### Improvements
- Enhanced overall extension performance
- Added comprehensive legal documentation and terms of service

### Fixes
- Improved stability and reliability across all browsers
- Fixed edge cases in content filtering logic

## [2.0.0] - 2026-05-08

### Features
- **Enhanced Content Filtering**: More granular control over YouTube recommendations and distracting elements
- **Improved Extension Architecture**: Better performance and reliability foundation
- **Expanded Capabilities**: Additional options for customizing the YouTube experience

### Improvements
- Significantly improved extension performance and responsiveness
- Better integration with YouTube's interface
- More reliable content filtering across different YouTube pages

## [0.1.0] - 2026-05-08

### Features
- **Initial Release**: DeTube is now available for Chrome, Firefox, Edge, and Opera
- **Distraction-Free YouTube**: Core functionality to hide algorithm-driven recommendations and clutter
- **Content Filtering**: Basic controls to customize what you see on YouTube
- Basic interface for enabling/disabling filters

[Unreleased]: https://github.com/THANSHEER/detube/compare/v3.5.0...HEAD
[3.5.0]: https://github.com/THANSHEER/detube/compare/v3.4.0...v3.5.0
[3.4.0]: https://github.com/THANSHEER/detube/compare/v3.3.0...v3.4.0
[3.3.0]: https://github.com/THANSHEER/detube/compare/v3.2.2...v3.3.0
[3.2.2]: https://github.com/THANSHEER/detube/compare/v3.2.1...v3.2.2
[3.2.1]: https://github.com/THANSHEER/detube/compare/v3.2.0...v3.2.1
[3.2.0]: https://github.com/THANSHEER/detube/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/THANSHEER/detube/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/THANSHEER/detube/compare/v2.0.1...v3.0.0
[2.0.1]: https://github.com/THANSHEER/detube/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/THANSHEER/detube/compare/v0.1.0...v2.0.0
[0.1.0]: https://github.com/THANSHEER/detube/releases/tag/v0.1.0
