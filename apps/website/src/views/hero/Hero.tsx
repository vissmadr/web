import { Sandtext } from "@packages/sandtext";
import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { A } from "@solidjs/router";

import css from "./Hero.module.css";

import vissmadrPNG from "./vissmadr.png";

export const Hero = () => {
  let canvasRef: HTMLCanvasElement | undefined;
  let containerRef: HTMLDivElement | undefined;
  let cleanupSandtext: (() => void) | undefined;

  const [isCanvasLoaded, setIsCanvasLoaded] = createSignal(false);

  const resize = () => {
    if (!canvasRef || !isCanvasLoaded()) return;
    if (!containerRef) return;
    const rect = containerRef.getBoundingClientRect();
    Sandtext.resize(rect.width, rect.height);
  };

  onMount(() => {
    const cleanup = Sandtext.main(canvasRef!);
    cleanupSandtext = cleanup || undefined;
    setIsCanvasLoaded(Boolean(cleanup));

    resize();
    window.addEventListener("resize", resize);
  });

  onCleanup(() => {
    window.removeEventListener("resize", resize);
    cleanupSandtext?.();
  });

  return (
    <header class={css.hero}>
      <div class={css.container} ref={containerRef}>
        <A href="/">
          <canvas class={css.canvas} ref={canvasRef} />

          <Show when={!isCanvasLoaded()}>
            <img class={css.backupimage} src={vissmadrPNG} alt="vissmadr" />
          </Show>
        </A>
      </div>
    </header>
  );
};
