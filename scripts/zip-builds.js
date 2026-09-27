#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '..')

const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'))
const version = pkg.version

function computeSha256(filePath) {
  const fileBuffer = fs.readFileSync(filePath)
  return crypto.createHash('sha256').update(fileBuffer).digest('hex')
}

try {
  console.log(`📦 Packaging SHA-based release for DeTube v${version}...`)

  // Clean up any legacy browser-specific or old zip/sha files
  const legacyPatterns = [
    /^detube-.*-v.*\.zip(\.sha256)?$/,
    /^detube-v.*\.zip(\.sha256)?$/,
    /^SHA256SUMS\.txt$/
  ]

  const filesInRoot = fs.readdirSync(rootDir)
  for (const file of filesInRoot) {
    if (legacyPatterns.some(pattern => pattern.test(file))) {
      try {
        fs.unlinkSync(path.join(rootDir, file))
        console.log(`   🧹 Removed legacy file: ${file}`)
      } catch {
        // ignore
      }
    }
  }

  // Canonical SHA-based release package: detube-${version}.zip and detube-${version}.zip.sha256
  const zipName = `detube-${version}.zip`
  const zipPath = path.join(rootDir, zipName)
  const shaPath = `${zipPath}.sha256`

  // Remove existing current-version zip and sha
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath)
  if (fs.existsSync(shaPath)) fs.unlinkSync(shaPath)

  // Primary dist directory to package (dist-chrome is standard Chromium MV3)
  const sourceDir = fs.existsSync(path.join(rootDir, 'dist-chrome'))
    ? path.join(rootDir, 'dist-chrome')
    : path.join(rootDir, 'dist')

  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Build directory not found (checked dist-chrome, dist). Run build first.`)
  }

  console.log(`   Zipping ${path.basename(sourceDir)} -> ${zipName}...`)
  execSync(`cd "${sourceDir}" && zip -r "${zipPath}" . -x "*.DS_Store" "*__MACOSX*"`)

  const hash = computeSha256(zipPath)
  fs.writeFileSync(shaPath, `${hash}  ${zipName}\n`)

  console.log(`   🔐 SHA-256 (${zipName}): ${hash}`)
  console.log(`   📄 Checksum saved: ${zipName}.sha256`)
  console.log('✅ Packaging and SHA-256 generation complete!')
} catch (error) {
  console.error('❌ Packaging failed:', error.message)
  process.exit(1)
}
