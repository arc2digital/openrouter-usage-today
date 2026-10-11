# Agent Instructions

These instructions apply to work in this repository. Keep changes focused on the requested behavior and preserve the existing VS Code extension UX.

## Project Context

This is a TypeScript VS Code extension that displays OpenRouter API-key usage in a status-bar item. The extension entrypoint is `src/extension.ts`; OpenRouter API access and analytics are in `src/analyticsService.ts`. User-facing settings and activation metadata are contributed in `package.json`.

## Working Practices

- Follow the existing TypeScript style and use the VS Code extension APIs already in use.
- Keep OpenRouter requests and usage-data handling within the analytics service; keep status-bar, command, and settings interactions in the extension layer.
- Treat the management API key as sensitive: never log it, hard-code it, or send it anywhere except the OpenRouter API. Avoid including credentials or real usage data in diagnostics and examples.
- When changing settings, commands, or user-visible behavior, keep `package.json` and `README.md` accurate.
- Prefer small changes and preserve existing defaults and supported VS Code compatibility unless the request says otherwise.

## Build and Validation

- Compile TypeScript with `npm run compile`.
- Run the linter with `npm run lint` when changes affect source code.
- There is no configured test script in `package.json`; do not claim tests ran unless a test runner is added and executed.
- For extension behavior changes, inspect the relevant VS Code command, setting, or status-bar path and validate the build.

## Skills Index

See [`SKILLS.md`](./SKILLS.md) for task-specific workflow guidance and suggested skill areas.

## Available Skills

| Skill | Description |
|-------|-------------|
| [Package](./skills/package/SKILL.md) | Package, validate, and locally install this VS Code extension as a VSIX for distribution. |
| [Publish](./skills/publish/SKILL.md) | Publish this VS Code extension to the VS Code Marketplace (Open VSX Registry). |
