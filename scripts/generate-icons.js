#!/usr/bin/env node
/**
 * generate-icons.js
 *
 * Converts SVG sources → PNG assets at all required sizes.
 * Uses @resvg/resvg-js (WebAssembly — no system dependencies, works on all platforms).
 *
 * Sources:
 *   public/icons/icon.svg → public/icons/icon16.png, icon32.png, icon48.png, icon128.png
 *   public/logo/logo.svg  → public/logo/logo.png (128×128), logo64.png (64×64)
 *
 * Run standalone: npm run generate-icons
 * Runs automatically as part of: npm run build
 */

import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

function renderPNG(svgPath, size, destPath) {
  const svg = readFileSync(svgPath, 'utf8')
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: size } })
  const png = resvg.render().asPng()
  writeFileSync(destPath, png)
  console.log(`  ✓ ${path.relative(ROOT, destPath).padEnd(44)} ${size}×${size}`)
}

// ── 1. Extension icons ───────────────────────────────────────────────────────
console.log('\n[generate-icons] Extension icons  (public/icons/icon.svg)')
const iconsDir = path.join(ROOT, 'public', 'icons')
const iconSVG  = path.join(iconsDir, 'icon.svg')

for (const size of [16, 32, 48, 128]) {
  renderPNG(iconSVG, size, path.join(iconsDir, `icon${size}.png`))
}

// ── 2. Logo PNGs ─────────────────────────────────────────────────────────────
console.log('\n[generate-icons] Logo images      (public/logo/logo.svg)')
const logoSVG = path.join(ROOT, 'public', 'logo', 'logo.svg')
const logoDir = path.join(ROOT, 'public', 'logo')

renderPNG(logoSVG, 128, path.join(logoDir, 'logo.png'))
renderPNG(logoSVG,  64, path.join(logoDir, 'logo64.png'))

console.log('\n[generate-icons] Done.\n')
