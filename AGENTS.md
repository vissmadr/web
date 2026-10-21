# Working in this repository

Use pnpm. Keep changes focused on the requested scope. Do not create a README.

## Setup and structure

- Use the Node version in `.node-version` and pnpm version in `package.json`.
- Install with `pnpm install`; use `--frozen-lockfile` for reproducible installs.
- `pnpm dev` starts the website on port 5173; `pnpm dev:sandbox` starts the sandbox on port 5174.
- `apps/website` owns public pages, article composition, and site styles.
- `apps/sandbox` develops demonstrations independently of website styles.
- `packages/topics` owns topic-specific Solid components and visualizations.
- `packages/math` owns framework-independent algorithms.
- Packages currently contain empty module placeholders. Add explicit subpath exports and workspace dependencies when implementations are introduced; Vite compiles package source with each app.
- `pnpm build` builds both apps. The public static output is `apps/website/dist/`; `pnpm preview` previews it.

## Architecture and workflow

- Dependency direction: apps -> topics -> math. Apps may also use math directly. No package may import from an app.
- Keep math framework-independent and free of browser globals.
- Declare every imported workspace/external package in the consuming package.json.
- Export explicit package subpaths. Do not add a barrel that eagerly imports all topics.
- Keep topic-specific behavior together; extract shared code for demonstrated reuse.
- Prefer plain CSS and browser APIs. Add dependencies only for a concrete requirement.
- Each demonstration owns its state and cleans up resources on unmount.
- Use strict TypeScript; avoid `any` and suppressions that hide boundary errors.
- Run `pnpm check`, `pnpm build`, and `pnpm format:check` after implementation changes.
- Keep this file current when commands or architecture change.
- Do not edit generated output, dependencies, or lockfile contents by hand.
- Do not deploy or choose a public license without a user request.
