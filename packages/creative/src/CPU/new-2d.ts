const defaultConfig = {
  width: 800,
  height: 800,
};

type Config = typeof defaultConfig;

let config: Config;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d", { alpha: false, desynchronized: true });
  if (!context) throw "Cannot get 2d context";

  return context;
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}): () => void {
  config = { ...defaultConfig, ...settings };

  const context = setupContext(canvas);

  let animationId: number;
  const animation = () => {
    animationId = requestAnimationFrame(animation);
  };

  animationId = requestAnimationFrame(animation);

  return () => {
    cancelAnimationFrame(animationId);
  };
}
