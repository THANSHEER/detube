#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'))
const version = pkg.version

const targets = ['chrome', 'firefox', 'edge', 'safari', 'opera']

try {
  console.log(`📦 Zipping builds for version ${version}...`)

  targets.forEach(target => {
    const dirName = `dist-${target}`
    const dirPath = path.join(rootDir, dirName)
    
    if (fs.existsSync(dirPath)) {
      const zipName = `detube-${target}-v${version}.zip`
      const zipPath = path.join(rootDir, zipName)

      // Remove existing zip if it exists
      if (fs.existsSync(zipPath)) {
        fs.unlinkSync(zipPath)
      }

      console.log(`   Zipping ${dirName} -> ${zipName}...`)
      
      // Use native zip command (available on macOS and Linux)
      // cd into the directory first so the zip doesn't contain the top-level folder
      execSync(`cd "${dirPath}" && zip -r "../${zipName}" . -x "*.DS_Store" "*__MACOSX*"`)
    } else {
      console.warn(`⚠️  Warning: ${dirName} not found, skipping...`)
    }
  })

  console.log('✅ Zipping complete!')
} catch (error) {
  console.error('❌ Zipping failed:', error.message)
  process.exit(1)
}
