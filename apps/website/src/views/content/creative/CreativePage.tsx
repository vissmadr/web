import { onMount, Show } from "solid-js";
import { type CreativeData } from "./creative-data";
import { TagsContainer } from "./TagsContainer";

import css from "./CreativePage.module.css";

interface Props {
  creative: CreativeData<any>;
}

export const CreativePage = (props: Props) => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    props.creative.main(canvasRef, props.creative.config);
  });

  return (
    <main class={css.main}>
      <article>
        <h1 class={css.title}>{props.creative.title}</h1>

        <div class={css.tags}>
          <TagsContainer tags={props.creative.tags} />
        </div>

        <figure class={css.canvascontainer}>
          <canvas class={css.canvas} ref={canvasRef} />
          <Show when={props.creative.description}>
            <figcaption class={css.description}>
              {props.creative.description}
            </figcaption>
          </Show>
        </figure>
      </article>
    </main>
  );
};
