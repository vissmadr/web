# AI Documentation

This directory is the canonical AI-maintained documentation area for this repository.

## Documents

- `architecture.md` -- workspace layout, dependency direction, apps, packages, and utilities.
- `codestyle.md` -- code-style and structure rules for TypeScript, Solid, CSS, WebGL, GLSL, and packages.
- `commands.md` -- install, dev, build, check, and filtered workspace commands.
- `creative-workflow.md` -- how creative sketches are structured, exposed, run, and cleaned up.
- `documentation-guide.md` -- rules for maintaining docs and respecting the human-only docs boundary.
- `packages.md` -- package responsibilities and public API notes.
- `utilities.md` -- utility package responsibilities, exports, and dependency rules.
- `website.md` -- website routing, layout, styling, and creative page behavior.

## Source Of Truth

- Current source code, `package.json`, `tsconfig`, `pnpm-workspace.yaml`, and `turbo.json` are authoritative.
- Update these docs when durable architecture, command, code-style, package, or workflow facts change.
- Do not treat generated directories as source truth.
- Do not read or use `docs-dev/`; it is human-only.
