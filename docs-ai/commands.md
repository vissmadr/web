# Commands

Run commands from the repository root unless noted otherwise.

## Install

- `pnpm install` -- install all workspace dependencies.

## Root Turbo Tasks

- `pnpm dev` -- run Turbo `dev` tasks. Dev tasks are persistent and uncached.
- `pnpm build` -- run Turbo `build` tasks with upstream build dependencies.
- `pnpm check` -- run Turbo `check` tasks with upstream check dependencies.

## Website

- `pnpm --filter website dev` -- start the website Vite dev server.
- `pnpm --filter website build` -- run `tsc -b` and build the website with Vite.
- `pnpm --filter website check` -- run website TypeScript project check.
- `pnpm --filter website preview` -- preview the website production build.

## Sandbox

- `pnpm --filter sandbox dev` -- start the sandbox Vite dev server.
- `pnpm --filter sandbox build` -- typecheck and build the sandbox.
- `pnpm --filter sandbox preview` -- preview the sandbox production build.

## Packages And Utilities

- `pnpm --filter @packages/creative check` -- typecheck the creative package.
- `pnpm --filter @packages/sandtext check` -- typecheck sandtext.
- `pnpm --filter @packages/prototype check` -- typecheck prototype.
- `pnpm --filter @packages/test check` -- typecheck test package.
- `pnpm --filter @packages/particle-origins check` -- typecheck particle-origins.
- `pnpm --filter @utilities/<name> check` -- typecheck a utility package.

## Validation Guidance

- For code changes in one workspace, run that workspace's filtered `check` first.
- For website route, component, or build config changes, run `pnpm --filter website check` and usually `pnpm --filter website build`.
- For shared package or utility changes, run the changed package's check and any obvious consumers.
- For broad dependency or TypeScript config changes, run `pnpm check`.
- There is no root test script configured at the time of writing.
