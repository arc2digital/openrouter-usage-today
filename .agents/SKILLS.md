# Skills Catalog

This file indexes reusable, task-specific agent workflows for this repository. Formal on-demand skills live in `.agents/skills/<skill-name>/SKILL.md` and include skill frontmatter.

## Suggested Skill Areas

- **VS Code extension changes** — Update activation, commands, status-bar UI, configuration contributions, and extension lifecycle behavior; build with `npm run compile` and verify related metadata/documentation.
- **OpenRouter API and analytics** — Work on requests, response parsing, and usage aggregation in `src/analyticsService.ts`; preserve failure behavior and never expose the management key.
- **Build and release validation** — Compile and lint changes, check extension metadata and packaging inputs, and report exactly which validation commands were run.
- **[VS Code extension packaging](./skills/package/SKILL.md)** — Create and validate VSIX packages and install them locally.
- **[VS Code extension publishing](./skills/publish/SKILL.md)** — Publish this extension to the VS Code Marketplace (Open VSX Registry).

## Applying a Skill

1. Choose a workflow relevant to the requested change; avoid loading unrelated guidance.
2. Follow repository-wide requirements in [`AGENTS.md`](./AGENTS.md).
3. Prefer adding a formal skill directory only when its workflow is repeatable and benefits from dedicated, on-demand instructions or assets.
