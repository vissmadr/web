import { A } from "@solidjs/router";

import { TagsContainer } from "./TagsContainer";
import { TagNames } from "./creative-tags";

import css from "./CreativeCard.module.css";

interface Props {
  title: string;
  route: string;
  thumbnail: string;
  tags: TagNames[];
}

export const CreativeCard = (props: Props) => {
  return (
    <div class={css.card}>
      <A class={css.link} href={props.route}>
        <div class={css.image_container}>
          <img class={css.image} src={props.thumbnail} />
        </div>

        <h2 class={css.title}>{props.title}</h2>

        <TagsContainer tags={props.tags} />
      </A>
    </div>
  );
};
