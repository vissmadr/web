# Utilities

Utilities are atomic TypeScript workspace packages under `utilities/*`.

## Package Pattern

Most utility packages use this structure:

```text
utilities/<name>/
  package.json
  tsconfig.json
  src/
    index.ts
    main.ts
```

The package manifest usually points both `exports` and `types` at `./src/index.ts` and exposes a `check` script with `tsc --noEmit`.

## Import Pattern

Prefer package-root imports:

```ts
import { Random } from "@utilities/random";
import { Vector2 } from "@utilities/data-structures";
import { WebGL } from "@utilities/webgl";
```

Do not import another workspace's internal source path unless that package explicitly exports the path.

## Utility Map

- `canvas2d` -- Canvas2D drawing and sizing helpers.
- `collision` -- collision helpers using web-style top-left coordinates.
- `colors` -- color helpers.
- `common` -- small general helpers.
- `data-structures` -- mutable vector classes and quadtree support.
- `easing` -- easing functions for animation/math.
- `mathematics` -- math helpers.
- `noise` -- TypeScript value, perlin, and simplex noise.
- `noise-glsl` -- GLSL noise snippets and declarations.
- `random` -- random-number helpers.
- `shapes` -- shape types and primitives.
- `sorting` -- sorting helpers.
- `text-shuffle` -- left-to-right text shuffle effect.
- `webgl` -- WebGL setup, shader, texture, canvas, point, and kernel helpers.

## Dependency Rules

- Utilities should stay small and reusable.
- Avoid adding runtime dependencies to utilities unless there is a clear reusable need.
- If a utility imports another utility, add the dependency explicitly to the importing utility's `package.json`.
- Utilities must not depend on `apps/*` or `packages/*`.
- Packages and apps should consume utilities through their package names, not relative paths.

## Validation

- Run `pnpm --filter @utilities/<name> check` after editing a utility.
- Also check obvious consumers if a public utility API changes.
