import { For } from "solid-js";
import { CreativeCard } from "./CreativeCard";
import { creatives } from "./creative-data";

import css from "./Creative.module.css";

export const Creative = () => {
  return (
    <div class="page">
      <h1>Creative</h1>

      <p>Creative things</p>

      <div class={css.cards_container}>
        <For each={creatives}>
          {(art) => (
            <CreativeCard
              title={art.title}
              route={art.route}
              thumbnail={art.thumbnail}
              tags={art.tags}
            />
          )}
        </For>
      </div>
    </div>
  );
};
