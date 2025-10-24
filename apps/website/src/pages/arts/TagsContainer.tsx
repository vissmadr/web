import { For } from "solid-js";
import { type TagData, type TagNames, creativeTags } from "./creative-tags";

import css from "./TagsContainer.module.css";

const Tag = (props: TagData) => {
  return (
    <div
      class={css.tag}
      style={{ "background-color": props.color, color: props.fontColor }}
    >
      {props.label}
    </div>
  );
};

export const TagsContainer = (props: { tags: TagNames[] }) => {
  return (
    <div class={css.wrapper}>
      <div class={css.tags_container}>
        <For each={props.tags}>
          {(tagName) => {
            const tag = creativeTags[tagName];
            return (
              <Tag
                color={tag.color}
                fontColor={tag.fontColor}
                label={tag.label}
              />
            );
          }}
        </For>
      </div>
    </div>
  );
};
