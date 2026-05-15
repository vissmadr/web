# Packages

Packages under `packages/*` are feature-rich workspaces consumed by apps and sometimes by other packages. They may depend on utilities, but they should not depend on apps.

## Shared Package Rules

- Use `workspace:*` for internal dependencies.
- Keep public APIs behind `src/index.ts`.
- Prefer namespace exports when matching existing package style.
- Add package dependencies explicitly to the importing package's `package.json`.
- Run `pnpm --filter @packages/<name> check` after TypeScript changes.

## `@packages/creative`

Main collection of creative sketches.

### Public API

- `src/index.ts` exports `Creative`.
- `src/main.ts` exports `CPU` and `GPU` namespaces.
- `package.json` exports the root and selected CPU/GPU wildcard paths.

### CPU Sketches

CPU sketches live under `src/CPU/` and usually use Canvas2D plus utilities for vectors, random numbers, easing, noise, collisions, and colors.

Examples include:

- connections
- easing functions
- firecrackers
- invoker orbs
- noise experiments
- pathfinder
- quadtree simulation
- system shock
- weave

### GPU Sketches

GPU sketches live under `src/GPU/` and usually keep TypeScript setup and GLSL shaders in the same sketch folder.

Examples include:

- anger
- game of life
- layers
- noise-2d
- regeneration
- sandfall
- stars
- tenthousand
- water
- wealth

`src/GPU/_templates/` contains starting points for new GPU experiments. `src/GPU/_archive/` contains old experiments and should not be treated as active website content without an explicit request.

## `@packages/sandtext`

WebGL2 transform-feedback text particle effect.

- `src/main.ts` owns runtime setup, shader linking, transform feedback, animation, resize, and cleanup entry points.
- `src/config.ts` owns `Config` and `defaultConfig`.
- `src/raw.ts` stores generated particle-origin data.
- `src/shaders/` contains compute and render GLSL programs.

The website depends on this package. Be careful with singleton state in `src/main.ts`; ensure repeated mounts do not leave stale animation loops or invalid WebGL state.

## `@packages/prototype`

Experimental Canvas2D package with gameplay-like systems. It is currently sandbox/support code rather than public website infrastructure.

Use it for prototyping, but do not make website architecture depend on prototype internals unless the package is intentionally promoted.

## `@packages/test`

Small sandbox-oriented experiment package. It is currently used by `apps/sandbox/src/index.ts`.

Treat it as temporary experimentation/support code, not a stable public API.

## `@packages/particle-origins`

Helper package for converting image pixel data into particle origins.

It has no runtime dependencies at the time of writing and should stay narrowly focused on particle-origin generation support.

## Validation

- Changed one package: run that package's filtered `check`.
- Changed a package consumed by `website`: also run `pnpm --filter website check` when feasible.
- Changed shader imports, Vite-facing code, or route-visible creative behavior: run a targeted website build when feasible.
