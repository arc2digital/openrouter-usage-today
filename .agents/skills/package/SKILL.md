---
name: package
description: 'Package, validate, and locally install this VS Code extension as a VSIX for distribution. Use when preparing a release, creating a VSIX, inspecting package contents, or troubleshooting extension packaging.'
---

# VS Code Extension Packaging

Use this guide to package this VS Code extension for distribution.

## Prerequisites

```bash
npm install -g @vscode/vsce
```

## Packaging Steps

### 1. Ensure package.json is complete

Your `package.json` must include:
- `name`, `displayName`, `version`
- `publisher` (optional for local use)
- `engines.vscode`
- `activationEvents`
- `main` entry point
- `contributes` section

### 2. Install development dependencies

```bash
npm install
npm run compile
```

### 3. Create .vscodeignore (optional but recommended)

```
.vscode/**
src/**
*.ts
*.tsbuildinfo
.yarnrc.yml
npm-debug.*
*.vsix
```

### 4. Package the extension

```bash
vsce package
```

This creates `your-extension-name-version.vsix` in the current directory.

### 5. Install locally

```bash
# From the terminal or command palette
vsce install openrouter-usage-today-0.0.1.vsix
```

Or via VSCode UI:
- `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows)
- Type "Extensions: Install from VSIX"
- Select the .vsix file

## Common Issues

### Missing repository field
Add a `repository` field to package.json or use `--allow-missing-repository`

### Missing LICENSE
Add a `LICENSE` file to your project

### Large package size
Ensure `.vscodeignore` excludes `src/` and `*.ts` files - only `out/*.js` should be included

## Verify packaging

```bash
vsce ls --tree
```

Lists all files that will be included in the package.
