# Deployment Guide: DeTube

This guide covers how to deploy the **DeTube (Beta)** extension to the Chrome Web Store, both manually and via automated workflows.

## 1. Manual Deployment (Immediate)

To deploy manually, you need to build the project, package it as a ZIP file, and upload it to the Chrome Developer Dashboard.

### Step 1: Build the Project
Run the build command:
```bash
npm run build
```
This will:
1. Build the CSS.
2. Build the Chrome extension into `dist-chrome`.
3. Build the Firefox extension into `dist-firefox`.
4. **Automatically create ZIP files** for both:
   - `detube-chrome-v1.0.0-beta.zip`
   - `detube-firefox-v1.0.0-beta.zip`

### Step 2: Upload to Chrome Web Store
1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
2. If you haven't already, sign in and pay the one-time $5 developer registration fee.
3. Click **+ New Item**.
4. Upload your `detube-chrome-v1.0.0-beta.zip` file.
5. Fill in the required metadata:
   - **Store Listing**: Description, Category, Icons (128x128), and Screenshots (at least one 1280x800 or 640x400).
   - **Privacy**: Explain why you need the `storage` permission and that you don't collect user data.
6. Click **Submit for Review**.

---

## 2. Automated Deployment (Future Setup)

To setup auto-deployment, we will use GitHub Actions. Every time you push a tag or a release, the extension will automatically build and upload to the store.

### Prerequisites
You need to generate API credentials from the [Google Cloud Console](https://console.cloud.google.com/):
1. Create a Project.
2. Enable the **Chrome Web Store API**.
3. Create **OAuth 2.0 Credentials** (Web Application).
4. Obtain a **Refresh Token** (using a tool like `chrome-webstore-upload-cli`).

### GitHub Secrets
Add the following secrets to your GitHub repository settings (`Settings > Secrets and variables > Actions`):
- `CHROME_APP_ID`: The ID of your extension (found in the dashboard after first manual upload).
- `CHROME_CLIENT_ID`: From Google Cloud.
- `CHROME_CLIENT_SECRET`: From Google Cloud.
- `CHROME_REFRESH_TOKEN`: Your OAuth refresh token.

### Proposed Workflow File
Create this file at `.github/workflows/deploy.yml`:

```yaml
name: Deploy Extension

on:
  push:
    tags:
      - 'v*' # Trigger on version tags like v1.0.1

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
          
      - name: Install Dependencies
        run: npm install
        
      - name: Build Chrome Extension
        run: npm run build:chrome
        
      - name: Zip Extension
        run: |
          cd dist-chrome
          zip -r ../detube.zip .
          
      - name: Upload to Chrome Web Store
        uses: chrome-plugin-production/chrome-webstore-upload@v2
        with:
          file-path: detube.zip
          extension-id: ${{ secrets.CHROME_APP_ID }}
          client-id: ${{ secrets.CHROME_CLIENT_ID }}
          client-secret: ${{ secrets.CHROME_CLIENT_SECRET }}
          refresh-token: ${{ secrets.CHROME_REFRESH_TOKEN }}
          publish: true
```

### Recommendation
I recommend doing the **first upload manually** to get your **Extension ID** and to verify that all store listing details (icons, descriptions) are correct. Once the first version is published, we can easily configure the automation.
