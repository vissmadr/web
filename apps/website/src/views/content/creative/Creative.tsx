import { For } from "solid-js";
import { CreativeCard } from "./CreativeCard";
import { creatives } from "./creative-data";

import css from "./Creative.module.css";

export const Creative = () => {
  return (
    <section aria-label="Creative">
      <div class={css.cards_container}>
        <For each={creatives}>
          {(creative) => (
            <CreativeCard
              title={creative.title}
              route={creative.route}
              thumbnail={creative.thumbnail}
              tags={creative.tags}
            />
          )}
        </For>
      </div>
    </section>
  );
};
