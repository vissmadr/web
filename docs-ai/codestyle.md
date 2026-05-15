# Code Style

Read this before non-trivial code edits.

## TypeScript

- Use ESM imports and exports.
- Follow `tsconfig.base.json`: strict TypeScript, ES2022, bundler module resolution, isolated modules, and no JS files.
- Prefer explicit exported function and type names over default exports.
- Keep package public APIs in `src/index.ts`.
- Existing namespace-style public exports are intentional, for example `export * as WebGL from "./webgl"`.
- Prefer package-root workspace imports such as `@utilities/random` and `@packages/creative`.
- Do not deep-import from another workspace's `src/*` unless that path is explicitly exported by its `package.json`.
- Keep changes minimal and local. Do not introduce abstractions unless multiple call sites need them now.
- Add JSDoc for public utility functions when behavior is not obvious from the name and types.
- Avoid `any`. If a browser or WebGL type is awkward, narrow it with the appropriate DOM/WebGL type.
- Throw `Error` objects for new error paths unless matching a nearby existing pattern.

## Solid And Website

- Use Solid primitives and JSX conventions already present in `apps/website`.
- Use `class`, not React's `className`.
- Use `<For>` for list rendering when following existing Solid style.
- Keep route and creative-card data in `creative-data.ts` when exposing website-visible creative work.
- Keep component-specific styles in CSS modules beside the component.
- Keep global typography, reset, and page-wide variables in `apps/website/src/styles/`.
- Preserve accessible labels, semantic sections, keyboard focus states, and mobile behavior when changing UI.

## Creative Canvas/WebGL Code

- Creative modules should accept an `HTMLCanvasElement` as their main runtime boundary.
- Return a cleanup function from `main` when setting animation frames, intervals, event listeners, GPU resources, or mutable singleton state.
- Cancel `requestAnimationFrame`, clear intervals, remove event listeners, and release WebGL resources in cleanup where practical.
- Keep shader setup explicit. WebGL code in this repo favors inspectable setup over hidden framework layers.
- Keep GLSL files next to the experiment that owns them.
- Use `@utilities/webgl` helpers for repeated shader, texture, point, and canvas setup patterns.
- Do not move archived/template GPU experiments into active website routes unless explicitly requested.

## Utilities

- Utilities should remain atomic, reusable, and dependency-light.
- If a utility needs another utility, add `workspace:*` to the importing utility's `package.json` and document the reason if the dependency direction becomes less obvious.
- Do not make utilities depend on apps or packages.
- Keep utility package structure consistent: `package.json`, `tsconfig.json`, `src/index.ts`, and implementation files under `src/`.
- Preserve top-left browser coordinate assumptions in collision/canvas helpers unless a change explicitly requires a different coordinate system.

## CSS

- Use CSS modules for component-scoped website styles.
- Use global CSS only for reset, shared variables, base document styles, and truly global primitives.
- Avoid generic framework-looking layouts when designing visible UI. Preserve the existing site visual language.
- Keep responsive behavior explicit and test desktop/mobile sizes when editing layout.

## Documentation And Comments

- Comments should explain non-obvious behavior, browser/WebGL constraints, or algorithm decisions.
- Do not add comments that restate the next line of code.
- When durable behavior changes, update `docs-ai/` in the same task.
