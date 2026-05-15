# Documentation Guide

This directory is maintained by AI assistants and should stay useful for future AI sessions.

## Ownership

- `docs-ai/` is AI-maintained and canonical for assistant-facing architecture, workflow, and code-style notes.
- `docs-dev/` is human-only. AI assistants must skip it completely.
- Root `AGENTS.md` is the high-signal orientation file and should link the repo map to the most important rules.

## Update Rules

- Update `docs-ai/` when durable architecture, commands, package responsibilities, dependency direction, or code-style rules change.
- Prefer concise durable facts over temporary task notes.
- Do not duplicate large source snippets unless the exact snippet is the documented API contract.
- Prefer current source code, `package.json`, `tsconfig`, `pnpm-workspace.yaml`, and `turbo.json` over stale prose.
- If docs disagree with code, fix the docs or explicitly note uncertainty if the code is ambiguous.
- Do not document generated files as source truth.

## Human-Only Boundary

AI assistants must not read, summarize, edit, move, delete, or use files in `docs-dev/` unless the user explicitly overrides this rule for a specific file and task.

If a task asks for repository documentation, use `docs-ai/` and source code. Do not inspect `docs-dev/` for context.

## Useful Documentation Pattern

For new durable docs, prefer this shape:

```text
# Topic

Brief purpose.

## Current Behavior

Durable source-backed facts.

## Workflow

Steps or conventions future assistants should follow.

## Important

Constraints, gotchas, and validation notes.
```

## Generated And Ignored Paths

Do not use these paths as documentation truth:

- `node_modules/`
- `.turbo/`
- `dist/`
- `build/`
- `.vercel/`
- `coverage/`
- `*.tsbuildinfo`
- `.env*`
