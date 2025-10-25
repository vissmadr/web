import { Sandtext } from "@packages/sandtext";
import { createSignal, onMount, Show } from "solid-js";

import css from "./Hero.module.css";
import vissmadrPNG from "./vissmadr.png";

export const Hero = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  const [isCanvasLoaded, setIsCanvasLoaded] = createSignal(false);

  onMount(() => {
    setIsCanvasLoaded(Sandtext.main(canvasRef!));
  });

  return (
    <div>
      <div class={css.title}>
        <canvas ref={canvasRef} />

        <Show when={!isCanvasLoaded()}>
          <img src={vissmadrPNG} />
        </Show>
      </div>

      <p>Self-taught sorcerer, software engineer, and game developer.</p>
    </div>
  );
};
