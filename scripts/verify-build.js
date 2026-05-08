#!/usr/bin/env node

/**
 * Verify that build outputs exist and contain required files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Verifying build outputs...\n');

const requiredFiles = {
  'dist-chrome': [
    'manifest.json',
    'index.html',
    'popup.js',
    'content.js',
    'background.js',
    'storage.js',
    'content/detube.css',
    'assets/index.css',
    'icons/icon16.png',
    'icons/icon32.png',
    'icons/icon48.png',
    'icons/icon128.png',
  ],
  'dist-firefox': [
    'manifest.json',
    'index.html',
    'popup.js',
    'content.js',
    'background.js',
    'storage.js',
    'content/detube.css',
    'assets/index.css',
    'icons/icon16.png',
    'icons/icon32.png',
    'icons/icon48.png',
    'icons/icon128.png',
  ],
  'dist-edge': [
    'manifest.json',
    'index.html',
    'popup.js',
    'content.js',
    'background.js',
    'storage.js',
    'content/detube.css',
    'assets/index.css',
    'icons/icon16.png',
    'icons/icon32.png',
    'icons/icon48.png',
    'icons/icon128.png',
  ],
  'dist-safari': [
    'manifest.json',
    'index.html',
    'popup.js',
    'content.js',
    'background.js',
    'storage.js',
    'content/detube.css',
    'assets/index.css',
    'icons/icon16.png',
    'icons/icon32.png',
    'icons/icon48.png',
    'icons/icon128.png',
  ],
  'dist-opera': [
    'manifest.json',
    'index.html',
    'popup.js',
    'content.js',
    'background.js',
    'storage.js',
    'content/detube.css',
    'assets/index.css',
    'icons/icon16.png',
    'icons/icon32.png',
    'icons/icon48.png',
    'icons/icon128.png',
  ]
};

let errors = 0;

Object.entries(requiredFiles).forEach(([buildDir, files]) => {
  console.log(`📁 Checking ${buildDir}/`);
  
  files.forEach(file => {
    const filePath = path.join(__dirname, `../${buildDir}/${file}`);
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const size = (stats.size / 1024).toFixed(2);
      console.log(`   ✅ ${file} (${size}KB)`);
    } else {
      console.error(`   ❌ ${file} - NOT FOUND`);
      errors++;
    }
  });
  
  console.log();
});

// Check manifest validity
['dist-chrome', 'dist-firefox', 'dist-edge', 'dist-safari', 'dist-opera'].forEach(buildDir => {
  const manifestPath = path.join(__dirname, `../${buildDir}/manifest.json`);
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      console.log(`✅ ${buildDir}/manifest.json is valid JSON`);
      console.log(`   - name: ${manifest.name}`);
      console.log(`   - version: ${manifest.version}`);
      console.log(`   - manifest_version: ${manifest.manifest_version}`);
      console.log(`   - permissions: ${JSON.stringify(manifest.permissions)}`);
    } catch (e) {
      console.error(`❌ ${buildDir}/manifest.json is invalid JSON: ${e.message}`);
      errors++;
    }
  }
});

console.log('\n' + '='.repeat(50));
if (errors === 0) {
  console.log('✅ Build verification PASSED\n');
  process.exit(0);
} else {
  console.error(`\n❌ Build verification FAILED with ${errors} error(s)\n`);
  process.exit(1);
}
