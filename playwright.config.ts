import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  use: {
    channel: 'chrome',
    headless: true,
    viewport: { width: 370, height: 490 },
  },
  webServer: {
    command: 'npx vite preview --port 4173 --outDir dist-chrome',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 15000,
  },
});
