# DeTube - Claude Code Guidelines

This document guides Claude Code on how to work effectively on DeTube - a privacy-focused YouTube distraction-free extension.

## Project Overview

**DeTube** is a browser extension (Chrome, Firefox, Edge, Opera) that helps users reclaim focus by hiding algorithm-driven recommendations, social metrics, and clutter on YouTube.

- **What it does**: Granular control over YouTube's interface
- **Key features**: Shorts hiding, comment hiding, related videos hiding, focus modes, grayscale mode
- **Tech stack**: React 18 + TypeScript, Vite, Vanilla CSS, Manifest V3
- **Users**: Active users across Chrome Web Store, Firefox AMO, Microsoft Edge Store
- **Platforms**: Chrome, Firefox, Edge, Opera, Safari (coming soon)

## Development Standards

### Code Quality
- TypeScript for type safety
- Modular CSS selectors (avoid global styles)
- React best practices with hooks
- Follow existing code style in the repo

### Testing & Release
- Always test on the actual extension before committing
- Follow semantic versioning (major.minor.patch)
- Keep CHANGELOG.md updated with user-facing language

### Commit Messages
- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `ci:`
- PR labels: `feature`, `enhancement`, `fix`, `bug`, `chore`, `documentation`, `ci`
- These labels drive the release-drafter and changelog generation

## Public Release Notes Standards

**IMPORTANT**: When generating release notes for public distribution, follow these guidelines:

### ✅ DO
- Use user-centric language ("Hide YouTube Shorts" not "Shorts hiding capability")
- Be specific about what changed (name the feature)
- Explain the benefit to users
- Include security/privacy notes for this extension type
- Use emojis: 🎯 Features, 🐛 Bug Fixes, 🔒 Security

### ❌ DON'T
- Use internal jargon ("version sync across manifests", "release management")
- Write generic statements ("UI improvements", "various enhancements")
- Be vague about features or changes
- Hide privacy/security information

### Example Good Release Note
```
### 🎯 What's New
- **YouTube Shorts Toggle**: New option in settings to hide Shorts from feed
- **Settings Panel Redesign**: Improved layout with clearer categorization

### 🐛 Bug Fixes
- Fixed settings not persisting on Firefox
- Resolved comment section not hiding on playlist pages

### 🔒 Security & Privacy
- All data remains local to your device
- No telemetry or tracking added in this release
```

## File Structure

```
src/
├── content/           # Content scripts
│   ├── css/          # Styles applied to YouTube
│   ├── js/           # Content script logic
│   └── models/       # Data models
├── popup/            # Extension popup UI (React)
├── options/          # Settings page (React)
├── background/       # Service worker
└── assets/           # Icons, images
```

## Key Configuration Files

- **CHANGELOG.md** - User-facing changelog (Keep a Changelog format)
- **.github/release-drafter-config.yml** - Configures automatic release notes generation
- **package.json** - Version source of truth
- **manifest.json** (per browser) - Extension metadata and permissions

## Common Tasks

### Creating a Release
1. Update version in `package.json`
2. Update CHANGELOG.md with user-facing release notes
3. Push to main - CI creates GitHub release automatically
4. Release drafter generates release notes from PR labels
5. **Ensure release notes are user-friendly** (follow standards above)

### Adding a Feature
1. Create feature branch from main
2. Use conventional commits: `feat: description`
3. Add label `feature` or `enhancement` to PR
4. Update CHANGELOG.md in the PR

### Fixing a Bug
1. Create fix branch from main  
2. Use conventional commits: `fix: description`
3. Add label `fix` or `bug` to PR
4. Briefly document in CHANGELOG.md

## Important Notes

- **Privacy extension**: Be transparent in communications
- **Multiple browsers**: Test on multiple platforms when touching manifest or core logic
- **Users first**: Always consider how changes affect end users
- **Accessibility**: Ensure UI changes are accessible
- **No telemetry**: Maintain privacy-first stance (no tracking, analytics, or data collection)

## Recent Release Patterns

- **v3.2.2**: Privacy policy transparency (good public release)
- **v3.2.1**: Version sync across platforms (internal-focused, could be better)
- **v3.2.0**: UI improvements (generic, needs specifics)
- **v3.1.0**: Shorts hiding feature (good - specific feature)

Newer releases should follow v3.2.2 pattern more closely for public distribution.

## Support Resources

- **GitHub Issues**: https://github.com/THANSHEER/detube/issues
- **CONTRIBUTING.md**: Setup and build instructions
- **documentation/DEVELOPMENT.md**: Technical development guide
