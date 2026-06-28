<div align="center">
  <h1>🤝 Contributing to DeTube</h1>
  <p>First off, thank you for considering contributing to DeTube! It's people like you that make this tool great.</p>
</div>

---

Welcome to the DeTube open-source repository! This guide provides everything you need to know about setting up the project locally, developing, building, and deploying the extension.

## 🚀 1. Installation & Setup

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js**: `v22.x` or higher
- **npm**: `v10.x` or higher
- **OS**: macOS, Linux, or Windows

### Cloning & Building
To get the extension running locally, follow these steps:

```bash
# 1. Clone the repository
git clone https://github.com/THANSHEER/detube.git
cd detube

# 2. Install dependencies
npm install

# 3. Rebuild the core CSS
node scripts/build-css.js

# 4. Build for your target browser
TARGET_BROWSER=chrome node node_modules/.bin/vite build
```

> [!NOTE]
> You can replace `chrome` with `firefox`, `safari`, `edge`, or `opera`. The resulting build will be placed in a dedicated directory (e.g., `dist-chrome/`).

---

## 🛠️ 2. Development Workflow

DeTube uses **Vite** for bundling, **React** for the UI, and modular vanilla CSS for the content injection.

### Watch Mode (Hot Reloading)
For automatic rebuilding of the extension during development, run one of the following commands:

```bash
# For Chrome development
npm run watch:chrome

# For Firefox development
npm run watch:firefox
```
> [!TIP]
> After saving a file in watch mode, simply refresh the extension in your browser's extension management page (`chrome://extensions/`) to see your changes!

### CSS Organization
The project uses modular CSS selectors located in `content/selectors/`. 
- 🏠 `homepage.css`: Home grid and recommendations.
- 📺 `video-page.css`: Player controls and sidebar.
- 👤 `channel.css`: Channel specific elements.
- 🧭 `header.css` & `sidebar.css`: Global navigation.

To combine these into the final `detube.css` file, run:
```bash
node scripts/build-css.js
```

---

## 🧪 3. Testing

Before submitting a Pull Request, please ensure all checks pass.

### Automated Tests
Run the following commands to validate CSS syntax and ensure all settings map correctly to existing CSS classes:
```bash
node scripts/validate-css.js
node scripts/validate-settings.js
```

### Manual Testing
1. Load the generated `dist-chrome` folder as an unpacked extension in your browser.
2. Open the extension popup on `youtube.com`.
3. Toggle features on and off and verify they apply instantly.

---

## 🍏 4. Safari Setup (macOS Only)

<details>
<summary><b>Click to expand Safari build instructions</b></summary>
<br>

To use DeTube on Safari, build the Safari target and then convert it to an Xcode project:

```bash
# 1. Build the Safari target
TARGET_BROWSER=safari node node_modules/.bin/vite build

# 2. Convert to Xcode project
xcrun safari-web-extension-converter dist-safari/ \
  --project-location ./safari-xcode \
  --app-name "DeTube" \
  --bundle-identifier dev.geekstash.detube \
  --macos-only \
  --no-open
```

### Run in Xcode
1. Open `safari-xcode/DeTube/DeTube.xcodeproj` in Xcode.
2. Select the **DeTube** macOS target and set your signing team.
3. Click **Run** (`⌘R`).

> [!WARNING]
> You must enable **Allow Unsigned Extensions** in Safari's **Develop** menu to test local builds.

*Note: DeTube includes API guards for `setBadgeText` and `chrome.alarms` to gracefully support Safari 15.4–16.3.*
</details>

---

## 📦 5. Deployment Guide

### Manual Deployment
To deploy manually, package the built output into a ZIP file:
```bash
TARGET_BROWSER=chrome node node_modules/.bin/vite build
node scripts/zip-builds.js
```
Upload the resulting `detube-[browser]-vX.X.X.zip` to the respective web store.

### Automated Deployment
The repository is prepared for GitHub Actions. Every time a new tag is pushed, the extension will automatically build. Add your Web Store credentials to GitHub Secrets to enable automated publishing.

---

## 🤝 6. Pull Request Workflow

We love Pull Requests! To ensure your changes are processed quickly, please follow these steps:

- [ ] **Test your changes**: Ensure `node scripts/validate-css.js` passes without warnings.
- [ ] **Use descriptive titles**: (e.g., `feature: Add grayscale mode to video player`). The title is used directly in our automated release notes!
- [ ] **Add Labels**: Add the appropriate label (`feature`, `bug`, `chore`, `documentation`).
- [ ] **Describe the "Why"**: In the PR body, briefly explain what you fixed or added and link any relevant GitHub Issues.

Our automated **Release Drafter** will group your PR under the correct category in the next release draft as soon as it is merged into `main`.

<div align="center">
  <p><b>Happy Coding! 🎉</b></p>
</div>
