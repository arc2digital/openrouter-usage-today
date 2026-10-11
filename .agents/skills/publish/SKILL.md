---
name: publish
description: 'Publish this VS Code extension to the VS Code Marketplace (Open VSX Registry). Use when releasing a new version, pushing updates, or making the extension available to the public.'
---

# Publishing to the VS Code Marketplace

Use this guide to publish this VS Code extension to the [Open VSX Registry](https://open-vsx.org/) (the default VS Code Marketplace).

## Prerequisites

### 1. Install `vsce` globally

```bash
npm install -g @vscode/vsce
```

### 2. Create a Personal Access Token (PAT)

1. Go to [Azure DevOps Personal Access Tokens](https://dev.azure.com/_usersSettings/tokens)
2. Create a new token with **Marketplace** scope (publish)
3. Copy the token value

### 3. Authenticate

Set the token as an environment variable:

```bash
export VSCE_PAT="your-personal-access-token"
```

Or log in interactively:

```bash
vsce login Arc2
```

This stores credentials in `~/.vscode/pat`.

## Publishing Steps

### 1. Ensure everything is up to date

```bash
npm install
npm run compile
npm run lint
```

### 2. Verify the package

```bash
vsce ls --tree
```

Confirm only the expected files are included (no `src/`, `.ts` files, or sensitive data).

### 3. Bump the version

Update the `version` field in `package.json` (follow [semver](https://semver.org/)):

```json
"version": "1.1.0"
```

### 4. Publish

```bash
vsce publish
```

This publishes the extension to the marketplace under the publisher name (`Arc2`).

### 5. Verify

Check the extension page at:
```
https://open-vsx.org/publishers/Arc2/extensions/openrouter-usage-today
```

## Version Bumping Options

| Command | Bump |
|---------|------|
| `vsce publish patch` | `1.0.1` |
| `vsce publish minor` | `1.1.0` |
| `vsce publish major` | `2.0.0` |

## Common Issues

### Authentication failed
- Ensure `VSCE_PAT` is set or run `vsce login Arc2`
- The PAT must have **Marketplace** publish scope

### Publisher not found
- Register your publisher at https://marketplace.visualstudio.com/manage/publishers
- The publisher name in `package.json` (`"publisher": "Arc2"`) must match exactly

### Version already exists
- Each version can only be published once
- Bump to a new version number in `package.json`

### Missing LICENSE or README
- Ensure `LICENSE` and `README.md` exist in the project root

### Large package size
- Check `.vscodeignore` excludes `src/`, `*.ts`, and other unnecessary files
- See `.vscodeignore` in the project root for the current exclusions

## Unpublish

You can unpublish a version within 72 hours of publishing:

```bash
vsce unpublish 1.0.0
```

After 72 hours, versions can no longer be unpublished.
