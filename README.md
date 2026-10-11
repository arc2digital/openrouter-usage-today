# OpenRouter Usage Today

A VS Code extension that shows your OpenRouter today's usage cost in the status bar.

Author: Noel da Costa
Publisher: Arc2 - www.arc2.co.uk

## Features

- Displays your OpenRouter usage cost for today in the status bar
- Automatically polls at configurable intervals (10s to 1h)
- Click the status bar item to refresh manually
- All data is fetched locally - your Management API key is stored only in VS Code settings

## Installation

1. Open VS Code
2. Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
3. Type `Extensions: Install from VSIX` and press Enter
4. Select the downloaded `.vsix` file (or build from source and load the unpacked extension)

## Setup

1. Create a Management API key at [OpenRouter Settings](https://openrouter.ai/settings/management-keys)
2. In VS Code settings, find `OpenRouter Usage Today: Management Key`
3. Paste your management key
4. Optionally configure the poll threshold

## Usage

- The status bar will show `OR: $X.XX` where X.XX is your today's cost
- If no key is configured, you'll see `OR: 🔑 Setup required`
- Click the status bar item to refresh manually
- The extension will auto-refresh based on your poll threshold setting

## Security

- Your management API key is stored **locally only** in VS Code settings (`vscode-userdata`)
- The key is used only to fetch your own usage data from OpenRouter
- Your key is never shared or transmitted anywhere except to OpenRouter's API

## Building from Source

```bash
npm install
npm run compile
```

Then load the unpacked extension in VS Code:
1. Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
2. Type `Developer: Load Extension from Source`
3. Select this folder

## License

MIT
