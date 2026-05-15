# Creative Workflow

Creative work in this repo is split between the public website, the sandbox app, and graphics packages.

## Package Layout

- `packages/creative/src/CPU/` contains Canvas2D and CPU-driven sketches.
- `packages/creative/src/GPU/` contains WebGL and GLSL-driven sketches.
- `packages/sandtext/` contains a separate WebGL2 transform-feedback text particle effect.
- `packages/prototype/` and `packages/test/` are sandbox-oriented experiments.

## Runtime Shape

Most creative modules should expose a function like this:

```ts
export function main(canvas: HTMLCanvasElement, settings?: Settings): () => void {
  // setup
  return () => {
    // cleanup
  };
}
```

If a module does not allocate animation loops, event handlers, intervals, or GPU resources, a cleanup function may be unnecessary. For new long-running sketches, prefer returning cleanup.

## Website Exposure

Website-visible creative work is driven by metadata in `apps/website/src/views/content/creative/creative-data.ts`.

When adding a public creative page, update the metadata with:

- title
- route
- thumbnail or visual asset reference
- tags from `creative-tags.ts`
- dynamic import or runtime callback matching existing entries

Also verify the gallery card, route page, mobile layout, and cleanup behavior when navigating away.

## Sandbox Use

`apps/sandbox/src/index.ts` is the quickest manual entry point for one experiment.

Use it by importing the target package namespace and calling the desired `main(canvas)` function on `#mainCanvas`. Keep sandbox changes small and do not treat sandbox wiring as public website behavior.

## WebGL And GLSL

- WebGL2 code should use explicit setup for shaders, buffers, vertex arrays, transform feedback, framebuffers, and textures.
- Use helpers from `@utilities/webgl` when they match the local pattern.
- Keep GLSL files beside their owning sketch.
- Vite GLSL imports require the workspace's Vite config to include the GLSL plugin.
- For shader snippets shared across modules, use a utility such as `@utilities/noise-glsl` rather than copy-pasting long shader functions.

## Cleanup Checklist

For creative code that starts runtime work, clean up:

- `requestAnimationFrame` loops
- intervals and timeouts
- pointer, keyboard, resize, and custom event listeners
- WebGL programs, shaders, buffers, vertex arrays, textures, framebuffers, and transform feedback objects where practical
- mutable singleton state that could affect a second mount

## Important

- Do not add archived or template GPU experiments to the website unless explicitly requested.
- Preserve mobile and pointer behavior when changing public creative pages.
- Keep visual experiments self-contained. Avoid introducing global state unless the owning package already uses that pattern.
