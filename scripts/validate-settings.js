#!/usr/bin/env node

/**
 * Validate that all Settings in the config registry have corresponding CSS rules.
 * Reads from: src/lib/config.ts (registry) and src/content/css/detube.css (compiled CSS)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Validating Settings to CSS mapping...\n');

// Read config.ts to extract setting keys and their CSS classes
const configPath = path.join(__dirname, '../src/lib/config.ts');
const configContent = fs.readFileSync(configPath, 'utf8');

// Extract all { key: '...', cssClass: '...' } pairs from the registry
const keyRegex = /key:\s*'([^']+)'/g;
const cssClassRegex = /cssClass:\s*'([^']+)'/g;

const keys = [];
const cssClasses = [];
let match;

while ((match = keyRegex.exec(configContent)) !== null) {
  keys.push(match[1]);
}
while ((match = cssClassRegex.exec(configContent)) !== null) {
  cssClasses.push(match[1]);
}

if (keys.length !== cssClasses.length) {
  console.error(`❌ Mismatch: found ${keys.length} keys but ${cssClasses.length} CSS classes`);
  process.exit(1);
}

console.log(`📊 Found ${keys.length} settings in config registry:\n`);

// Read CSS to check for corresponding rules
const cssPath = path.join(__dirname, '../src/content/css/detube.css');

if (!fs.existsSync(cssPath)) {
  console.error(`❌ Error: ${cssPath} not found.`);
  console.error('💡 Please run "npm run build:css" first to generate the combined CSS file.\n');
  process.exit(1);
}

const css = fs.readFileSync(cssPath, 'utf8');

let missingRules = [];
let foundRules = [];

keys.forEach((key, i) => {
  const cssClass = cssClasses[i];

  if (css.includes(cssClass)) {
    console.log(`✅ ${key} → .${cssClass}`);
    foundRules.push(key);
  } else {
    console.log(`⚠️  ${key} → .${cssClass} (NO CSS RULE FOUND)`);
    missingRules.push({ key, cssClass });
  }
});

console.log('\n' + '='.repeat(50));
console.log(`\n📈 Summary:`);
console.log(`   ✅ Settings with CSS rules: ${foundRules.length}/${keys.length}`);

if (missingRules.length > 0) {
  console.warn(`\n⚠️  Settings WITHOUT CSS rules (${missingRules.length}):`);
  missingRules.forEach(({ key, cssClass }) => {
    console.warn(`   - ${key} (needs: html.${cssClass} { display: none !important; })`);
  });
  console.log('\n⚠️  Note: Some settings might not have CSS (e.g., settings that need JS logic)\n');
  process.exit(0);
} else {
  console.log('✅ All settings have CSS rules!\n');
  process.exit(0);
}
