# DeTube Development Guide

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16+)
- **npm**

### Installation
```bash
# Install dependencies
npm install

# Build for all browsers
npm run build
```

## 🛠️ Development Workflow

### Watch Mode
For automatic rebuilding of the extension during development, use:
```bash
# For Chrome
npm run watch:chrome

# For Firefox
npm run watch:firefox
```
After saving a file, simply refresh the extension in your browser's extension management page.

### CSS Organization
The project uses modular CSS selectors located in `content/selectors/`.
- `header.css`: Global navigation and masthead.
- `sidebar.css`: Sidebar navigation entries.
- `homepage.css`: Home grid and recommendations.
- `video-page.css`: Player controls and sidebar.
- `channel.css`: Channel specific elements.

The combined CSS is generated in `content/detube.css` by running `npm run build:css`.

## 🧪 Testing

### Automated Tests
Run the following to validate CSS syntax and settings mapping:
```bash
npm run test
```

### Manual Testing Procedures
1. Load the `dist-chrome` or `dist-firefox` folder as an unpacked extension.
2. Open the extension popup.
3. Toggle features and verify they apply instantly on [youtube.com](https://youtube.com).
4. Verify that "Master Toggles" correctly hide entire categories.

## 📁 Project Structure
- `src/content/`: Injected script that manages CSS classes on the `<html>` tag.
- `src/popup/`: React-based extension popup UI.
- `src/lib/storage.ts`: Central source of truth for settings and defaults.
- `content/selectors/`: Modular CSS files.
- `scripts/`: Build and validation scripts.

## 🚀 Releasing
1. Update version in `package.json`.
2. Run `npm run build`.
3. Test thoroughly in multiple browsers.
4. Create a Git tag and push to main.
