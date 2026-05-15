import { A } from "@solidjs/router";

import { TagNames } from "./creative-tags";
import { TagsContainer } from "./TagsContainer";

import css from "./CreativeCard.module.css";

interface Props {
  title: string;
  route: string;
  thumbnail: string;
  tags: TagNames[];
}

export const CreativeCard = (props: Props) => {
  return (
    <article class={css.card}>
      <A class={css.link} href={props.route} aria-label={`Open ${props.title}`}>
        <div class={css.imageContainer}>
          <img class={css.image} src={props.thumbnail} alt="" loading="lazy" />
        </div>
        <div class={css.content}>
          <h3 class={css.title}>{props.title}</h3>
          <TagsContainer tags={props.tags} compact />
        </div>
      </A>
    </article>
  );
};
