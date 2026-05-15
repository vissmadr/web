# Architecture

This repository is a TypeScript monorepo for a personal website and creative graphics experiments.

## Workspace Layers

- `apps/*` are runnable/buildable entry points.
- `packages/*` are feature-rich libraries, experiments, or support packages.
- `utilities/*` are atomic reusable modules.

Dependency direction should stay one-way:

```text
apps -> packages -> utilities
apps -> utilities
```

Utilities should not depend on apps or packages. Packages should not depend on apps. If any workspace imports another workspace, declare it in the importing workspace's `package.json` with `workspace:*`.

## Root

- `package.json` owns root scripts: `build`, `dev`, and `check` through Turbo.
- `pnpm-workspace.yaml` registers `apps/*`, `packages/*`, and `utilities/*`.
- `turbo.json` defines `build`, `check`, and `dev` task behavior.
- `tsconfig.base.json` is the strict shared TypeScript baseline.
- `pnpm-lock.yaml` pins dependency resolution.

## Apps

### `apps/website`

Solid/Vite personal website.

- Entry point: `apps/website/src/index.tsx`.
- Routing uses `@solidjs/router`.
- The root layout lives under `apps/website/src/layout/`.
- Main sections live under `apps/website/src/views/`.
- Creative route metadata lives in `apps/website/src/views/content/creative/creative-data.ts`.
- Styling uses `styles/reset.css`, `styles/style.css`, and component CSS modules.
- The Vite build uses Solid, GLSL imports, and single-file output plugins.

### `apps/sandbox`

Minimal Vite app for manually running one canvas/WebGL experiment.

- Entry point: `apps/sandbox/src/index.ts`.
- Switch the imported package and called `main(canvas)` function to run another experiment.
- This app is a development playground, not the public website.

## Packages

### `packages/creative`

Main creative experiment collection.

- Public API: `src/index.ts` exports `Creative` from `src/main.ts`.
- `src/main.ts` exports `CPU` and `GPU` namespaces.
- `src/CPU/` contains Canvas2D and CPU-driven sketches.
- `src/GPU/` contains WebGL/GLSL sketches, templates, and archive experiments.
- Most website-visible sketches should expose a `main(canvas, settings?)` function and return a cleanup function when they allocate loops, event handlers, or WebGL resources.

### `packages/sandtext`

WebGL2 transform-feedback text particle effect.

- Public API: `src/index.ts` exports `SandText` from `src/main.ts`.
- `src/main.ts` owns WebGL setup, transform feedback, animation loop, and resize behavior.
- `src/config.ts` owns defaults and configuration shape.
- `src/raw.ts` stores particle-origin data.
- `src/shaders/` stores compute and render GLSL programs.

### `packages/prototype`

Canvas prototype package with gameplay-style experimentation such as camera, player, enemies, and rendering helpers.

### `packages/test`

Small experiment package currently used by the sandbox for path/grid style testing.

### `packages/particle-origins`

Support package for deriving particle origin data from image pixels.

## Utilities

Utilities are small package-root imports such as `@utilities/random` or `@utilities/webgl`.

- Keep public APIs behind `src/index.ts`.
- Keep package exports pointed at `./src/index.ts`.
- Avoid deep imports from another package's `src` unless the package explicitly exports that path.
- Keep utilities browser-safe unless a package is explicitly documented otherwise.

## Generated Paths

These paths are generated or local-only and are not documentation truth:

- `node_modules/`
- `.turbo/`
- `dist/`
- `build/`
- `.vercel/`
- `coverage/`
- `*.tsbuildinfo`
- `.env*`
