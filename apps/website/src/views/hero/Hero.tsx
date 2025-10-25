import { Sandtext } from "@packages/sandtext";
import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { A } from "@solidjs/router";

import css from "./Hero.module.css";

import vissmadrPNG from "./vissmadr.png";

export const Hero = () => {
  let canvasRef: HTMLCanvasElement | undefined;
  let containerRef: HTMLDivElement | undefined;

  const [isCanvasLoaded, setIsCanvasLoaded] = createSignal(false);

  const resize = () => {
    if (!canvasRef || !isCanvasLoaded()) return;
    if (!containerRef) return;
    const rect = containerRef.getBoundingClientRect();
    Sandtext.resize(rect.width, rect.height);
  };

  onMount(() => {
    setIsCanvasLoaded(Sandtext.main(canvasRef!));

    resize();
    window.addEventListener("resize", resize);
  });

  onCleanup(() => {
    window.removeEventListener("resize", resize);
  });

  return (
    <div class={css.hero}>
      <div class={css.container} ref={containerRef}>
        <A href="/">
          <canvas class={css.canvas} ref={canvasRef} />

          <Show when={!isCanvasLoaded()}>
            <img class={css.backupimage} src={vissmadrPNG} />
          </Show>
        </A>
      </div>
    </div>
  );
};
