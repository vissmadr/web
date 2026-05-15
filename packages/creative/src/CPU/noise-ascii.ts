import { Mathematics } from "@utilities/mathematics";
import { Noise } from "@utilities/noise";

const defaultConfig = {
  width: 600,
  height: 600,

  gap: 30,
  gapOffset: 0.9,

  spriteWidth: 15,
  spriteHeight: 15,

  noiseFrequency: 0.03,
  timeIncrement: 0.0015,

  colors: {
    background: "#111111",
    font: "#999999",
  },

  characters: [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ],
};

type Config = typeof defaultConfig;

let config: Config;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d", { alpha: false, desynchronized: true });
  if (!context) throw "Cannot get 2d context!";

  return context;
}

function renderBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = config.colors.background;
  context.fillRect(0, 0, config.width, config.height);
}

function setupSprites() {
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

    const spriteContext = sprite.getContext("2d", { alpha: true });
    if (!spriteContext) throw "Cannot get 2d context!";
    spriteContext.font = `${width}px Arial, sans-serif`;
    spriteContext.fillStyle = config.colors.font;
    spriteContext.textAlign = "center";
    spriteContext.textBaseline = "middle";
    spriteContext.textRendering = "optimizeLegibility";
    spriteContext.fillText(config.characters[i], halfWidth, halfHeight + yOffset);

    sprites.push(sprite);
  }

  return sprites;
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}): () => void {
  config = { ...defaultConfig, ...settings };

  const context = setupContext(canvas);

  const sprites = setupSprites();

  const size = (config.width - 2 * config.gap) / config.spriteWidth;
  const gap = config.gap * config.gapOffset;
  const charactersLength = config.characters.length;
  const xPositions = new Float32Array(size);
  const yPositions = new Float32Array(size);
  const xNoiseOffsets = new Float32Array(size);
  const yNoiseOffsets = new Float32Array(size);

  for (let i = 0; i < size; i++) {
    xPositions[i] = gap + i * config.spriteWidth;
    yPositions[i] = gap + i * config.spriteHeight;
    xNoiseOffsets[i] = i * config.noiseFrequency;
    yNoiseOffsets[i] = i * config.noiseFrequency;
  }

  let time = 0;
  let animationId: number;
  const animation = () => {
    time += config.timeIncrement;

    renderBackground(context);

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const noiseValue = Noise.Simplex.get(xNoiseOffsets[x] + time, yNoiseOffsets[y] + time);

        const noiseIndex = Math.min(Math.floor(Mathematics.lerp(0, charactersLength, noiseValue)) | 0, charactersLength - 1);

        context.drawImage(sprites[noiseIndex], xPositions[x], yPositions[y]);
      }
    }

    animationId = requestAnimationFrame(animation);
  };

  animationId = requestAnimationFrame(animation);

  return () => {
    cancelAnimationFrame(animationId);
  };
}
