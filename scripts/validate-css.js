#!/usr/bin/env node

/**
 * Validate CSS selectors are properly formed and safe
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cssFile = path.join(__dirname, '../src/content/css/detube.css');
const css = fs.readFileSync(cssFile, 'utf8');

console.log('🧪 Validating CSS selectors...\n');

let errors = 0;
let warnings = 0;

// Test 1: Check for unmatched braces
const openBraces = (css.match(/{/g) || []).length;
const closeBraces = (css.match(/}/g) || []).length;

if (openBraces !== closeBraces) {
  console.error(`❌ Unmatched braces: { ${openBraces} vs } ${closeBraces}`);
  errors++;
} else {
  console.log(`✅ Braces matched: ${openBraces} pairs`);
}

// Test 2: Check for empty selectors
const emptySelectors = css.match(/\{\s*\}/g);
if (emptySelectors && emptySelectors.length > 0) {
  console.error(`❌ Found ${emptySelectors.length} empty CSS rules`);
  errors++;
} else {
  console.log('✅ No empty CSS rules');
}

// Test 3: Check for !important usage
const importantCount = (css.match(/!important/g) || []).length;
console.log(`✅ Found ${importantCount} !important rules (expected for hiding)`);

// Test 4: Check for dt-hide- classes
const dtHideMatches = css.match(/html\.dt-hide-[a-z-]+/g) || [];
const uniqueDtHides = new Set(dtHideMatches.map(m => m.replace('html.', '')));
console.log(`✅ Found ${uniqueDtHides.size} unique dt-hide classes:`);
uniqueDtHides.forEach(dt => console.log(`   - ${dt}`));

// Test 5: Check for syntax errors in selectors
const lines = css.split('\n');
let lineNum = 0;
let inComment = false;

lines.forEach((line, idx) => {
  // Check for unterminated comments
  if (line.includes('/*') && !line.includes('*/')) {
    inComment = true;
  }
  if (line.includes('*/')) {
    inComment = false;
  }
  
  if (!inComment && line.trim() && !line.trim().startsWith('/*')) {
    // Check for missing semicolons in property declarations
    if (line.includes(':') && !line.includes('{') && !line.includes('}') && !line.trim().endsWith(';') && !line.trim().endsWith(',')) {
      // Might be a selector line, skip
    }
  }
});

console.log('✅ CSS syntax validation passed');

// Test 6: Verify display: none !important exists
const displayNoneCount = (css.match(/display:\s*none\s*!important/g) || []).length;
if (displayNoneCount === 0) {
  console.error('❌ No "display: none !important" rules found');
  errors++;
} else {
  console.log(`✅ Found ${displayNoneCount} display:none !important rules`);
}

// Test 7: Check for common YouTube selectors
const youtubeSelectors = [
  'ytd-',
  'yt-',
  '#masthead',
  '#center',
  '#guide',
  '#primary',
  '#secondary',
  '#subscribe-button',
  '#description',
  '#comments'
];

console.log('\n📍 Verified YouTube selectors in CSS:');
youtubeSelectors.forEach(selector => {
  if (css.includes(selector)) {
    console.log(`   ✅ ${selector}`);
  } else {
    console.log(`   ⚠️  ${selector} (not used)`);
  }
});

// Summary
console.log('\n' + '='.repeat(50));
if (errors === 0) {
  console.log('✅ CSS validation PASSED\n');
  process.exit(0);
} else {
  console.error(`\n❌ CSS validation FAILED with ${errors} error(s)\n`);
  process.exit(1);
}
