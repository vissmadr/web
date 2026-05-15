import { Colors } from "@utilities/colors";
import { Noise } from "@utilities/noise";

import systemShockPNG from "./system-shock.png";

const defaultConfig = {
  width: 600,
  height: 600,

  imageWidth: 86,
  imageHeight: 72,

  spriteWidth: 11,
  spriteHeight: 11,

  minBrightness: 0.1,

  updateChance: 0.008,

  noiseFrequency: 0.3,

  timeIncrement: 0.01,

  colors: {
    background: "#111111",
    font: "#999999",
  },

  characters: ["1", "2", "3", "a", "b", "c", "A", "B", "X"],
};

type Config = typeof defaultConfig;

function setupContext(canvas: HTMLCanvasElement, config: Config) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d", { alpha: false, desynchronized: true, willReadFrequently: true });
  if (!context) throw "Cannot get 2d context";

  return context;
}

function createImageData(context: CanvasRenderingContext2D, image: HTMLImageElement, config: Config) {
  context.drawImage(image, 0, 0, config.imageWidth, config.imageHeight);

  const imageData = context.getImageData(0, 0, config.imageWidth, config.imageHeight).data;

  context.clearRect(0, 0, config.width, config.height);

  const arr = new Uint8Array(config.imageWidth * config.imageHeight);

  const step = (255 * 3) / config.characters.length;

  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i + 0];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    const index = i / 4;
    // arr[x][y] = `rgb(${r},${g},${b})`;
    arr[index] = Math.min(Math.floor((r + g + b) / step), config.characters.length - 1);
  }

  return arr;
}

function createSprites(color: string, config: Config) {
  const sprites: HTMLCanvasElement[] = [];

  const width = config.spriteWidth;
  const height = config.spriteHeight;
  const halfWidth = width * 0.5;
  const halfHeight = height * 0.5;

  const yOffset = height * 0.1;

  for (let i = 0; i < config.characters.length; i++) {
    const sprite = document.createElement("canvas");
    sprite.width = width;
    sprite.height = height;

    const spriteContext = sprite.getContext("2d", { alpha: false });
    if (!spriteContext) throw "Cannot get 2d context!";
    spriteContext.font = `${width}px Arial, sans-serif`;
    spriteContext.textAlign = "center";
    spriteContext.textBaseline = "middle";
    spriteContext.textRendering = "optimizeLegibility";
    spriteContext.fillStyle = config.colors.background;
    spriteContext.fillRect(0, 0, width, height);
    spriteContext.fillStyle = color;
    spriteContext.fillText(config.characters[i], halfWidth, halfHeight + yOffset);

    sprites.push(sprite);
  }

  return sprites;
}

function createAllSprites(config: Config) {
  const allSprites: HTMLCanvasElement[][] = [];

  for (let i = 0; i < config.characters.length; i++) {
    const brightness = config.minBrightness + (i * (1 - config.minBrightness)) / config.characters.length;
    const color = Colors.getRGBGrayscale(brightness);
    const sprites = createSprites(color, config);
    allSprites.push(sprites);
  }

  return allSprites;
}

function start(canvas: HTMLCanvasElement, image: HTMLImageElement, config: Config, animationState: { id: number }) {
  const context = setupContext(canvas, config);

  const imageData = createImageData(context, image, config);

  const allSprites = createAllSprites(config);

  const xRatio = config.width / config.imageWidth;
  const yRatio = config.height / config.imageHeight;
  const xPositions = new Float32Array(config.imageWidth);
  const yPositions = new Float32Array(config.imageHeight);
  const xNoiseOffsets = new Float32Array(config.imageWidth);
  const updateCount = Math.max(1, Math.floor(config.imageWidth * config.imageHeight * config.updateChance));

  for (let x = 0; x < config.imageWidth; x++) {
    xPositions[x] = x * xRatio;
    xNoiseOffsets[x] = x * config.noiseFrequency;
  }

  for (let y = 0; y < config.imageHeight; y++) {
    yPositions[y] = y * yRatio;
  }

  let time = 0;
  const animation = () => {
    time += config.timeIncrement;

    for (let i = 0; i < updateCount; i++) {
      const x = (Math.random() * config.imageWidth) | 0;
      const y = (Math.random() * config.imageHeight) | 0;

        const brightness = imageData[y * config.imageWidth + x];

        const xNoise = xNoiseOffsets[x];
        const yNoise = (y + time) * config.noiseFrequency;
        const character = Math.min(
          Math.floor(Noise.Simplex.get(xNoise, yNoise) * config.characters.length),
          config.characters.length - 1,
        );

      context.drawImage(allSprites[brightness][character], xPositions[x], yPositions[y]);
    }

    animationState.id = requestAnimationFrame(animation);
  };

  animationState.id = requestAnimationFrame(animation);
}

export function main(canvas: HTMLCanvasElement, config: Partial<Config> = {}): () => void {
  const cfg: Config = { ...defaultConfig, ...config };

  const animationState = { id: 0 };

  const image = new Image();
  image.src = systemShockPNG;
  image.onload = () => {
    start(canvas, image, cfg, animationState);
  };

  return () => {
    cancelAnimationFrame(animationState.id);
  };
}
