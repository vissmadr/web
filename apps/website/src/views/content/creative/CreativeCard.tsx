import { A } from "@solidjs/router";

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
      <A href={props.route} target="_blank" rel="noopener noreferrer">
        <div class={css.image_container}>
          <img class={css.image} src={props.thumbnail} />
        </div>
      </A>
    </div>
  );
};
