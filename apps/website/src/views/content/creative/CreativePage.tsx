import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { type CreativeData } from "./creative-data";
import { TagsContainer } from "./TagsContainer";

import css from "./CreativePage.module.css";

interface Props {
  creative: CreativeData;
}

export const CreativePage = (props: Props) => {
  let canvasRef: HTMLCanvasElement | undefined;
  let cleanupCreative: (() => void) | undefined;
  let disposed = false;

  const [status, setStatus] = createSignal<"loading" | "ready" | "error">("loading");

  const releaseCanvasResources = () => {
    if (!canvasRef) return;

    const webgl = canvasRef.getContext("webgl2") ?? canvasRef.getContext("webgl");
    webgl?.getExtension("WEBGL_lose_context")?.loseContext();
    canvasRef.width = 0;
    canvasRef.height = 0;
  };

  onMount(() => {
    if (!canvasRef) throw new Error("Invalid canvasRef");

    props.creative
      .load()
      .then((creative) => {
        if (!canvasRef) throw new Error("Invalid canvasRef");

        const cleanup = creative.main(canvasRef, props.creative.config);
        if (disposed) {
          cleanup();
          releaseCanvasResources();
          return;
        }

        cleanupCreative = cleanup;
        setStatus("ready");
      })
      .catch((error) => {
        console.error(`Failed loading creative: ${props.creative.title}`, error);
        setStatus("error");
      });
  });

  onCleanup(() => {
    disposed = true;
    cleanupCreative?.();
    releaseCanvasResources();
  });

  return (
    <div class={css.main}>
      <article>
        <figure class={css.canvascontainer}>
          <canvas
            class={css.canvas}
            ref={canvasRef}
            role="img"
            aria-label={`${props.creative.title} interactive generative artwork`}
          />
          <Show when={status() === "loading"}>
            <figcaption class={css.description}>Loading creative...</figcaption>
          </Show>
          <Show when={status() === "error"}>
            <figcaption class={css.description}>This creative failed to load.</figcaption>
          </Show>
          <Show when={props.creative.description}>
            <figcaption class={css.description}>
              {props.creative.description}
            </figcaption>
          </Show>
        </figure>

        <div class={css.tags}>
          <TagsContainer tags={props.creative.tags} />
        </div>
      </article>
    </div>
  );
};
