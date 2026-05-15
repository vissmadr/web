import { Mathematics } from "@utilities/mathematics";
import { Noise } from "@utilities/noise";
import { Config, defaultConfig } from "./config";

import theSeerPNG from "./the-seer.png";

let config: Config;

type Particle = {
  active: boolean;
  lifetime: number;
  angle: number;
  x: number;
  y: number;
};

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  canvas.style.border = "1.5px solid gray";

  const context = canvas.getContext("2d", { alpha: false, desynchronized: true, willReadFrequently: true });
  if (!context) throw "Cannot get 2d context";

  return context;
}

function setupInput(canvas: HTMLCanvasElement) {
  const onPointerMove = (event: PointerEvent) => {
    const bounds = canvas.getBoundingClientRect();
    input.x = event.clientX - bounds.left;
    input.y = event.clientY - bounds.top;
  };

  const onPointerDown = () => {
    input.clicked = true;
  };

  const onPointerUp = () => {
    input.clicked = false;
  };

  const onBlur = () => {
    input.clicked = false;
  };

  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("blur", onBlur);

  return () => {
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("blur", onBlur);
  };
}

function createParticles() {
  const particles: Particle[] = [];

  for (let i = 0; i < config.cachedParticles; i++) {
    const randomAngle = Math.random() * Mathematics.TAU;

    particles.push({
      active: false,
      lifetime: 0,
      angle: randomAngle,
      x: Infinity,
      y: Infinity,
    });
  }

  return particles;
}

function renderBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = config.backgroundColor;
  context.fillRect(0, 0, config.width, config.height);
}

// -----------
// -- State --
// -----------

const input: { x: number; y: number; clicked: boolean } = {
  x: 0,
  y: 0,
  clicked: false,
};

let spawnIndex = 0;

// ----------
// -- Main --
// ----------

function createImageData(context: CanvasRenderingContext2D, image: HTMLImageElement) {
  context.drawImage(image, 0, 0, config.imageWidth, config.imageHeight);
  const imageData = context.getImageData(0, 0, config.imageWidth, config.imageHeight).data;
  context.clearRect(0, 0, config.width, config.height);

  const arr: string[] = new Array(config.imageWidth * config.imageHeight);
  const colorCache = new Map<number, string>();

  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i + 0];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    const colorKey = (r << 16) | (g << 8) | b;
    const cachedColor = colorCache.get(colorKey);
    if (cachedColor) {
      arr[i / 4] = cachedColor;
    } else {
      const color = `rgb(${r},${g},${b})`;
      colorCache.set(colorKey, color);
      arr[i / 4] = color;
    }
  }

  return arr;
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}): () => void {
  config = { ...defaultConfig, ...settings };

  const cleanupInput = setupInput(canvas);
  const context = setupContext(canvas);
  const particles = createParticles();
  const activeParticles: Particle[] = [];

  renderBackground(context);

  // -----------
  // -- Image --
  // -----------

  let animationId: number;

  const img = new Image();
  img.src = theSeerPNG;
  img.onload = () => {
    const pixelData = createImageData(context, img);

    const xRatio = config.width / config.imageWidth;
    const yRatio = config.height / config.imageHeight;

    const loop = () => {
      if (input.clicked) {
        spawnIndex++;
        spawnIndex %= config.cachedParticles;

        const particle = particles[spawnIndex];
        if (!particle.active) {
          particle.active = true;
          activeParticles.push(particle);
        }
        particle.lifetime = config.lifetime;
        particle.x = input.x;
        particle.y = input.y;
      }

      for (let i = activeParticles.length - 1; i >= 0; i--) {
        const particle = activeParticles[i];

        // Lifetime
        particle.lifetime -= config.decay;
        if (particle.lifetime <= 0) {
          particle.active = false;
          const lastParticle = activeParticles.pop();
          if (lastParticle && lastParticle !== particle) {
            activeParticles[i] = lastParticle;
          }
          continue;
        }

        // Movement
        const noise = Noise.Simplex.get(particle.x * config.noiseFrequency, particle.y * config.noiseFrequency);
        particle.angle += (noise * 2 - 1) * config.noiseEffect;
        particle.x += Math.cos(particle.angle) * config.speed;
        particle.y += Math.sin(particle.angle) * config.speed;

        // Bounds
        if (particle.x >= config.width) particle.x = config.width;
        else if (particle.x <= 0) particle.x = 0;
        if (particle.y >= config.height) particle.y = config.height;
        else if (particle.y <= 0) particle.y = 0;

        // Image Index
        let xIndex = Math.floor(particle.x / xRatio);
        let yIndex = Math.floor(particle.y / yRatio);

        // Image Index Bounds
        if (xIndex <= 0) xIndex = 0;
        else if (xIndex >= config.imageWidth) xIndex = config.imageWidth - 1;
        if (yIndex <= 0) yIndex = 0;
        else if (yIndex >= config.imageHeight) yIndex = config.imageHeight - 1;

        // Render
        context.fillStyle = pixelData[yIndex * config.imageWidth + xIndex];
        const size = particle.lifetime * config.size;
        context.fillRect(particle.x, particle.y, size, size);
      }

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
  };

  return () => {
    cancelAnimationFrame(animationId);
    cleanupInput();
  };
}
