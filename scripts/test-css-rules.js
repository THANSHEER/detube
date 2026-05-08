#!/usr/bin/env node

/**
 * Test that CSS rules are properly formed and match the config registry.
 * Validates: selectors, !important usage, YouTube element coverage.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing CSS rules...\n');

const cssPath = path.join(__dirname, '../src/content/css/detube.css');
const css = fs.readFileSync(cssPath, 'utf8');

let errors = 0;
let passedTests = 0;
let totalTests = 0;

// -------------------------------------------------------------------------
// Test 1: Key selectors from each section
// -------------------------------------------------------------------------

const testPatterns = {
  'Header Rules': [
    { pattern: /html\.dt-hide-search\s+#center/, desc: 'Hide search bar selector' },
    { pattern: /html\.dt-hide-voice-search\s+#voice-search-button/, desc: 'Hide voice search selector' },
    { pattern: /html\.dt-hide-notifications/, desc: 'Hide notifications selector' },
    { pattern: /html\.dt-hide-create-button/, desc: 'Hide create button selector' },
    { pattern: /html\.dt-hide-suggest-content/, desc: 'Hide suggest content selector' },
  ],
  'Sidebar Rules': [
    { pattern: /html\.dt-hide-home/, desc: 'Hide home selector' },
    { pattern: /html\.dt-hide-shorts/, desc: 'Hide shorts selector' },
    { pattern: /html\.dt-hide-subscriptions/, desc: 'Hide subscriptions selector' },
    { pattern: /html\.dt-hide-history/, desc: 'Hide history selector' },
    { pattern: /html\.dt-hide-you-section/, desc: 'Hide you section selector' },
    { pattern: /html\.dt-hide-playlists/, desc: 'Hide playlists selector' },
    { pattern: /html\.dt-hide-watch-later/, desc: 'Hide watch later selector' },
    { pattern: /html\.dt-hide-liked-videos/, desc: 'Hide liked videos selector' },
    { pattern: /html\.dt-hide-explore-section/, desc: 'Hide explore section selector' },
    { pattern: /html\.dt-hide-more-from-youtube/, desc: 'Hide more from youtube selector' },
  ],
  'Homepage Rules': [
    { pattern: /html\.dt-hide-home-recommendations/, desc: 'Hide home recommendations' },
    { pattern: /html\.dt-hide-shorts-section/, desc: 'Hide shorts section' },
  ],
  'Video Page Rules': [
    { pattern: /html\.dt-center-player/, desc: 'Center player rule' },
    { pattern: /html\.dt-hide-subscribe\s+#subscribe-button/, desc: 'Hide subscribe button' },
    { pattern: /html\.dt-hide-join-button\s+#sponsor-button/, desc: 'Hide join button' },
    { pattern: /html\.dt-hide-description\s+#description/, desc: 'Hide description' },
    { pattern: /html\.dt-hide-comments\s+#comments/, desc: 'Hide comments' },
    { pattern: /html\.dt-hide-related-videos/, desc: 'Hide related videos' },
    { pattern: /html\.dt-hide-share-button/, desc: 'Hide share button' },
    { pattern: /html\.dt-hide-likes/, desc: 'Hide likes' },
  ],
  'Channel Page Rules': [
    { pattern: /html\.dt-hide-channel-name/, desc: 'Hide channel name' },
    { pattern: /html\.dt-hide-channel-handle/, desc: 'Hide channel handle' },
    { pattern: /html\.dt-hide-channel-tabs/, desc: 'Hide channel tabs' },
    { pattern: /html\.dt-hide-subscriber-count/, desc: 'Hide subscriber count' },
    { pattern: /html\.dt-hide-video-count/, desc: 'Hide video count' },
    { pattern: /html\.dt-hide-channel-home/, desc: 'Hide channel home tab' },
    { pattern: /html\.dt-hide-channel-videos/, desc: 'Hide channel videos tab' },
    { pattern: /html\.dt-hide-channel-members/, desc: 'Hide channel members' },
  ],
  'Filter Rules': [
    { pattern: /html\.dt-grayscale-video/, desc: 'Grayscale video filter' },
  ],
};

Object.entries(testPatterns).forEach(([section, patterns]) => {
  console.log(`\n${section}:`);

  patterns.forEach(({ pattern, desc }) => {
    totalTests++;
    if (pattern.test(css)) {
      console.log(`   ✅ ${desc}`);
      passedTests++;
    } else {
      console.error(`   ❌ ${desc}`);
      errors++;
    }
  });
});

// -------------------------------------------------------------------------
// Test 2: All display:none rules have !important
// -------------------------------------------------------------------------

console.log(`\n!important Rules:`);
totalTests++;
const displayNoneRules = css.match(/display:\s*none/g) || [];
const displayNoneImportant = css.match(/display:\s*none\s*!important/g) || [];

if (displayNoneRules.length === displayNoneImportant.length) {
  console.log(`   ✅ All ${displayNoneRules.length} display:none rules have !important`);
  passedTests++;
} else {
  console.error(`   ❌ ${displayNoneRules.length - displayNoneImportant.length} display:none rules without !important`);
  errors++;
}

// -------------------------------------------------------------------------
// Test 3: Common YouTube selectors present
// -------------------------------------------------------------------------

console.log(`\n📍 YouTube selectors in CSS:`);
const youtubeSelectors = [
  'ytd-', 'yt-', '#center', '#primary', '#secondary',
  '#subscribe-button', '#description', '#comments',
];

youtubeSelectors.forEach(selector => {
  if (css.includes(selector)) {
    console.log(`   ✅ ${selector}`);
  } else {
    console.log(`   ⚠️  ${selector} (not used)`);
  }
});

// -------------------------------------------------------------------------
// Summary
// -------------------------------------------------------------------------

console.log('\n' + '='.repeat(50));
console.log(`\n📊 Test Results:`);
console.log(`   ✅ Passed: ${passedTests}/${totalTests}`);
console.log(`   ❌ Failed: ${errors}/${totalTests}`);

if (errors === 0) {
  console.log('\n✅ CSS rules validation PASSED\n');
  process.exit(0);
} else {
  console.error(`\n❌ CSS rules validation FAILED\n`);
  process.exit(1);
}
