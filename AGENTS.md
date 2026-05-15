# Web

TypeScript monorepo for a personal Solid website, creative canvas/WebGL experiments, reusable visual packages, and small atomic utilities.

## Tech Stack

- **Language**: TypeScript (`strict`, ES2022, ESM)
- **Package Manager**: pnpm (`10.14.0`)
- **Build Orchestration**: Turbo
- **Frontend**: Solid, Solid Router, Vite
- **Styling**: Global CSS plus CSS modules in the website app
- **Graphics**: Canvas2D, WebGL2, GLSL imported through Vite GLSL plugins
- **Testing**: No dedicated test runner is configured; validation is currently TypeScript checks and builds

## Commands

- `pnpm install` -- install workspace dependencies.
- `pnpm dev` -- run Turbo `dev` tasks.
- `pnpm build` -- run Turbo `build` tasks.
- `pnpm check` -- run Turbo `check` tasks.
- `pnpm --filter website dev` -- run the website app locally.
- `pnpm --filter website build` -- typecheck and build the website.
- `pnpm --filter website check` -- typecheck the website.
- `pnpm --filter sandbox dev` -- run the sandbox app locally.
- `pnpm --filter @packages/creative check` -- typecheck the creative package.

## Architecture

- This repository is a pnpm workspace with `apps/*`, `packages/*`, and `utilities/*` from `pnpm-workspace.yaml`.
- Dependency direction is intentional: apps may depend on packages and utilities; packages may depend on utilities; utilities should stay atomic and self-contained.
- Root `package.json` owns workspace-level scripts only. Individual workspaces own their app/package scripts.
- `tsconfig.base.json` is the shared strict TypeScript baseline. Workspace `tsconfig.json` files extend it and include local `src` files.
- Workspace dependencies use `workspace:*`; add explicit dependencies to the package that imports them.
- Public package APIs should flow through `src/index.ts`, usually re-exporting `src/main.ts` as a namespace.
- `apps/website` is the public Solid/Vite personal website. It owns routing, layout, page composition, and creative-work metadata.
- `apps/sandbox` is a minimal manual playground for running one canvas/WebGL experiment at a time.
- `packages/creative` is the main collection of CPU and GPU visual sketches. Website creative routes consume it through metadata in `apps/website/src/views/content/creative/creative-data.ts`.
- `packages/sandtext` owns the WebGL2 transform-feedback text particle effect used by the website.
- `packages/prototype`, `packages/test`, and `packages/particle-origins` are experimental/support packages used by the sandbox or creative workflow.
- `utilities/*` are small reusable modules such as vectors, canvas helpers, WebGL setup helpers, noise, easing, colors, collisions, shapes, sorting, and text shuffle.
- Generated dependency/build/cache output is not documentation truth and should not be edited.

## Project Structure

```text
README.md                               -- setup notes and monorepo dependency-layer overview
AGENTS.md                               -- repo map, architecture summary, canonical file inventory, and agent-facing working notes
guide.md                                -- human TODO notes; use current code and docs-ai over stale TODO text
package.json                            -- root pnpm/Turbo scripts and root dev dependencies
pnpm-lock.yaml                          -- pinned pnpm dependency graph
pnpm-workspace.yaml                     -- workspace globs for apps, packages, and utilities
tsconfig.base.json                      -- shared strict TypeScript compiler options
turbo.json                              -- Turbo task graph for build, check, and dev
docs-ai/
  README.md                             -- AI-maintained documentation index and source-of-truth rules
  architecture.md                       -- workspace architecture, dependency direction, and package responsibilities
  codestyle.md                          -- TypeScript, Solid, WebGL, GLSL, CSS, and package style rules for AI assistants
  commands.md                           -- root and filtered pnpm/Turbo command reference
  documentation-guide.md                -- AI documentation ownership, update rules, and docs-dev boundary
  creative-workflow.md                  -- conventions for creative sketches, website metadata, sandbox use, and cleanup functions
  packages.md                           -- package responsibilities and public API notes
  utilities.md                          -- utility package map and dependency/export rules
  website.md                            -- website routing, layout, styling, and creative page behavior
docs-dev/
  README.md                             -- human-only documentation area; AI assistants must ignore this directory completely
apps/
  website/
    README.md                           -- website-specific TODO notes
    package.json                        -- Solid/Vite app scripts and dependencies
    vite.config.ts                      -- website Vite config with Solid, GLSL, and single-file build plugins
    public/
      solid.svg                         -- static public asset
    src/
      index.tsx                         -- Solid entry point, router, creative route registration, and global CSS imports
      types.d.ts                        -- app-level ambient types
      vite-env.d.ts                     -- Vite client declarations
      layout/
        Layout.tsx                      -- top-level route layout shell
        Layout.module.css               -- layout styles
      styles/
        reset.css                       -- CSS reset
        style.css                       -- global website styles
      views/
        content/
          Content.tsx                   -- homepage content composition
          about/                        -- about section component and CSS module
          contact/                      -- contact section component and CSS module
          creative/                     -- creative gallery, cards, tags, route page, metadata, and CSS modules
          not-found/                    -- fallback route component and CSS module
        footer/                         -- footer component and CSS module
        hero/                           -- hero component and CSS module
  sandbox/
    package.json                        -- Vite sandbox scripts and dependencies
    vite.config.ts                      -- sandbox Vite config with GLSL and single-file plugins
    src/
      index.ts                          -- manual canvas entry point for running one selected package experiment
      declarations.d.ts                 -- sandbox ambient declarations
      vite-env.d.ts                     -- Vite client declarations
packages/
  creative/
    package.json                        -- `@packages/creative` exports, TypeScript check, and utility dependencies
    tsconfig.json                       -- creative package TypeScript config
    src/
      index.ts                          -- public namespace export for `Creative`
      main.ts                           -- CPU and GPU namespace exports
      types.d.ts                        -- creative ambient declarations
      CPU/                              -- Canvas2D/CPU sketches and helper folders
      GPU/                              -- WebGL/GLSL sketches, shader files, templates, and archive experiments
  sandtext/
    package.json                        -- `@packages/sandtext` exports and dependencies
    tsconfig.json                       -- sandtext TypeScript config
    src/
      index.ts                          -- public namespace export for `SandText`
      main.ts                           -- WebGL2 transform-feedback particle text runtime
      config.ts                         -- sandtext configuration and defaults
      raw.ts                            -- generated particle-origin data
      types.d.ts                        -- GLSL/module declarations
      shaders/                          -- compute and render GLSL programs
  prototype/
    package.json                        -- `@packages/prototype` exports and dependencies
    tsconfig.json                       -- prototype TypeScript config
    src/                                -- canvas prototype entry points and runtime code
  test/
    package.json                        -- `@packages/test` exports and dependencies
    tsconfig.json                       -- test package TypeScript config
    src/                                -- sandbox-oriented grid/pathfinding experiment code
  particle-origins/
    package.json                        -- `@packages/particle-origins` exports
    tsconfig.json                       -- particle-origins TypeScript config
    src/                                -- image-to-particle-origin helper code
utilities/
  canvas2d/                             -- Canvas2D drawing and sizing helpers
  collision/                            -- top-left-coordinate collision helpers and README notes
  colors/                               -- color conversion/helpers
  common/                               -- small common helpers
  data-structures/                      -- `Vector2`, `Vector3`, `Vector4`, and `Quadtree`
  easing/                               -- easing functions
  mathematics/                          -- math helpers
  noise/                                -- TypeScript value/perlin/simplex noise
  noise-glsl/                           -- GLSL noise snippets and declarations
  random/                               -- random-number helpers
  shapes/                               -- shared shape types
  sorting/                              -- sorting helpers
  text-shuffle/                         -- text shuffle effect and usage README
  webgl/                                -- WebGL setup, shader, texture, points, and canvas helpers
node_modules/                           -- generated dependencies; ignore
.turbo/                                 -- generated Turbo cache/logs; ignore
dist/                                   -- generated build output; ignore
```

## Important

- Always read `docs-ai/codestyle.md` before writing non-trivial code.
- For documentation work, read `docs-ai/documentation-guide.md` first.
- `docs-ai/` is the AI-maintained documentation area. Keep it current when durable architecture, workflow, or code-style facts change.
- `docs-dev/` is human-only documentation. AI assistants must not read, summarize, edit, move, delete, or use files in `docs-dev/` unless the user explicitly overrides this rule for a specific file and task.
- Prefer current source code, `package.json` files, and `tsconfig` files over stale prose if anything disagrees.
- Use `pnpm`, not npm or yarn, for workspace commands.
- Preserve dependency direction: apps -> packages -> utilities. Do not make utilities depend on apps or packages.
- Keep utilities small and dependency-light. If a utility imports another workspace package, add the dependency explicitly and reconsider whether the utility is still atomic.
- Do not edit generated or ignored paths such as `node_modules/`, `.turbo/`, `dist/`, `build/`, `.vercel/`, `coverage/`, `.env*`, or `*.tsbuildinfo`.
- Do not commit secrets, local environment files, build output, dependency folders, or cache files.
- Run the smallest relevant check after code changes, usually `pnpm --filter <workspace> check`; use `pnpm check` or targeted builds for broader changes.
