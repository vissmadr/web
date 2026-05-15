# Website

`apps/website` is the public Solid/Vite personal website.

## Entry And Routing

- Entry point: `apps/website/src/index.tsx`.
- The app renders into `#root` and throws if the root element is missing.
- Routing uses `@solidjs/router` with `Layout` as the router root.
- `/` renders the homepage `Content` component.
- Creative routes are generated from `creatives` in `creative-data.ts`.
- `*404` renders the not-found view.

## Layout And Sections

- `src/layout/Layout.tsx` owns the top-level route shell.
- `src/views/content/Content.tsx` composes homepage content.
- `src/views/hero/` owns the hero section.
- `src/views/content/about/` owns the about section.
- `src/views/content/contact/` owns contact content.
- `src/views/footer/` owns the footer.
- `src/views/content/not-found/` owns fallback route UI.

## Creative Gallery

Creative gallery files live in `src/views/content/creative/`.

- `Creative.tsx` renders the creative-work section and cards.
- `CreativeCard.tsx` renders one gallery card.
- `CreativePage.tsx` renders an individual creative route.
- `TagsContainer.tsx` renders tag UI.
- `creative-data.ts` is the route/gallery metadata source.
- `creative-tags.ts` owns tag definitions.

When adding a website-visible creative sketch, update `creative-data.ts` and ensure the route, card, tags, thumbnail, dynamic import, mount behavior, and unmount cleanup all work.

## Styling

- `src/styles/reset.css` is the reset.
- `src/styles/style.css` contains global site styling.
- Component styles use CSS modules next to their components.
- Use Solid's `class` attribute with imported CSS module objects.
- Preserve responsive behavior for desktop and mobile.

## Build Tooling

- `vite.config.ts` configures Solid, GLSL imports, and single-file build behavior.
- GLSL imports in website-consumed packages rely on Vite plugin support.
- `package.json` scripts are `dev`, `build`, `check`, and `preview`.

## Important

- Keep public website behavior in the website app. Do not move app-level routing or page composition into packages without a concrete need.
- Keep creative package code independent from website CSS and routing.
- If a creative module allocates animation or WebGL state, route unmounting should trigger cleanup.
- Avoid adding UI frameworks or state libraries unless explicitly requested.
