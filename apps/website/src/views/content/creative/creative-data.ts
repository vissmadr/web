import { TagNames } from "./creative-tags";

import theSeerPNG from "./assets/the-seer.png";
import layersPNG from "./assets/layers.png";
import noise2DPNG from "./assets/noise-2d.png";
import randomWalkersPNG from "./assets/random-walkers.png";
import noiseLoopPNG from "./assets/noise-loop.png";
import noiseAsciiPNG from "./assets/noise-ascii.png";
import tenThousandPNG from "./assets/ten-thousand.png";
import overgrowthPNG from "./assets/overgrowth.png";
import firecrackersPNG from "./assets/firecrackers.png";
import systemShockPNG from "./assets/system-shock.png";
import regenerationPNG from "./assets/regeneration.png";
import trigonometryPNG from "./assets/trigonometry.png";
import angerPNG from "./assets/anger.png";
import wealthPNG from "./assets/wealth.png";
import starsPNG from "./assets/stars.png";
import gameOfLifePNG from "./assets/game-of-life.png";
import weavePNG from "./assets/weave.png";
import connectionsPNG from "./assets/connections.png";
import pathfinderPNG from "./assets/pathfinder.png";
import waterPNG from "./assets/water.png";
import quadtreeSimulationPNG from "./assets/quadtree-simulation.png";

export type CreativeModule<T = unknown> = {
  main: (canvas: HTMLCanvasElement, settings?: Partial<T>) => () => void;
};

export interface CreativeData<T = unknown> {
  title: string;
  route: string;
  load: () => Promise<CreativeModule<T>>;
  config?: Partial<T>;
  thumbnail: string;
  tags: TagNames[];
  description?: string;
}

// INFO: This enables the LSP to find the correct config type
function setupConfig<T>(config: CreativeData<T>): CreativeData<T> {
  return config;
}

const configs = {
  theSeer: setupConfig({
    title: "The Seer",
    route: "the-seer",
    load: () => import("@packages/creative/CPU/the-seer/main"),
    thumbnail: theSeerPNG,
    tags: [TagNames.Input, TagNames.Particles, TagNames.Image, TagNames.Noise],
  }),

  wealth: setupConfig({
    title: "Wealth",
    route: "wealth",
    load: () => import("@packages/creative/GPU/wealth/main"),
    thumbnail: wealthPNG,
    tags: [
      TagNames.Input,
      TagNames.GPU,
      TagNames.Particles,
      TagNames.Noise,
      TagNames.Physics,
    ],
  }),

  connections: setupConfig({
    title: "Connections",
    route: "connections",
    load: () => import("@packages/creative/CPU/connections/main"),
    thumbnail: connectionsPNG,
    tags: [TagNames.Input, TagNames.Collision, TagNames.Physics],
  }),

  pathfinder: setupConfig({
    title: "Pathfinder",
    route: "pathfinder",
    load: () => import("@packages/creative/CPU/pathfinder/main"),
    thumbnail: pathfinderPNG,
    tags: [TagNames.Pathfinding, TagNames.Noise, TagNames.Random],
  }),

  systemShock: setupConfig({
    title: "System Shock",
    route: "system-shock",
    load: () => import("@packages/creative/CPU/system-shock/main"),
    thumbnail: systemShockPNG,
    tags: [TagNames.ASCII, TagNames.Image, TagNames.Noise, TagNames.Random],
  }),

  gameOfLife: setupConfig({
    title: "Game of Life",
    route: "game-of-life",
    load: () => import("@packages/creative/GPU/game-of-life/main"),
    thumbnail: gameOfLifePNG,
    tags: [TagNames.Input, TagNames.GPU, TagNames.Automata],
  }),

  layers: setupConfig({
    title: "Layers",
    route: "layers",
    load: () => import("@packages/creative/GPU/layers/main"),
    thumbnail: layersPNG,
    tags: [TagNames.Input, TagNames.GPU, TagNames.Image],
  }),

  overgrowth: setupConfig({
    title: "Overgrowth",
    route: "overgrowth",
    load: () => import("@packages/creative/CPU/overgrowth"),
    thumbnail: overgrowthPNG,
    tags: [TagNames.Input, TagNames.Particles, TagNames.Noise],
  }),

  firecrackers: setupConfig({
    title: "Firecrackers",
    route: "firecrackers",
    load: () => import("@packages/creative/CPU/firecrackers"),
    thumbnail: firecrackersPNG,
    tags: [TagNames.Input, TagNames.Particles, TagNames.Noise],
  }),

  randomWalkers: setupConfig({
    title: "Random Walkers",
    route: "random-walkers",
    load: () => import("@packages/creative/CPU/random-walkers"),
    thumbnail: randomWalkersPNG,
    tags: [TagNames.Random],
  }),

  weave: setupConfig({
    title: "Weave",
    route: "weave",
    load: () => import("@packages/creative/CPU/weave/main"),
    thumbnail: weavePNG,
    tags: [TagNames.Bright, TagNames.Image, TagNames.Random],
  }),

  stars: setupConfig({
    title: "Stars",
    route: "stars",
    load: () => import("@packages/creative/GPU/stars/main"),
    thumbnail: starsPNG,
    tags: [TagNames.GPU, TagNames.Particles, TagNames.Random],
  }),

  tenThousand: setupConfig({
    title: "Ten Thousand",
    route: "ten-thousand",
    load: () => import("@packages/creative/GPU/tenthousand/main"),
    thumbnail: tenThousandPNG,
    tags: [TagNames.GPU, TagNames.Particles, TagNames.Image],
  }),

  anger: setupConfig({
    title: "Anger",
    route: "anger",
    load: () => import("@packages/creative/GPU/anger/main"),
    thumbnail: angerPNG,
    tags: [TagNames.GPU, TagNames.Noise],
  }),

  water: setupConfig({
    title: "Water",
    route: "water",
    load: () => import("@packages/creative/GPU/water/main"),
    thumbnail: waterPNG,
    tags: [TagNames.GPU, TagNames.Noise],
  }),

  regeneration: setupConfig({
    title: "Regeneration",
    route: "regeneration",
    load: () => import("@packages/creative/GPU/regeneration/main"),
    thumbnail: regenerationPNG,
    tags: [TagNames.Input, TagNames.GPU, TagNames.Particles, TagNames.Physics],
  }),

  trigonometry: setupConfig({
    title: "Trigonometry",
    route: "trigonometry",
    load: () => import("@packages/creative/CPU/trigonometry"),
    thumbnail: trigonometryPNG,
    tags: [TagNames.Education],
  }),

  quadtreeSimulation: setupConfig({
    title: "Quadtree Simulation",
    route: "quadtree-simulation",
    load: () => import("@packages/creative/CPU/quadtree-simulation"),
    thumbnail: quadtreeSimulationPNG,
    tags: [TagNames.Education, TagNames.Particles],
  }),

  noiseLoop: setupConfig({
    title: "Noise Loop",
    route: "noise-loop",
    load: () => import("@packages/creative/CPU/noise-loop"),
    thumbnail: noiseLoopPNG,
    tags: [TagNames.Noise],
  }),

  noise2D: setupConfig({
    title: "Noise 2D",
    route: "noise-2d",
    load: () => import("@packages/creative/GPU/noise-2d/main"),
    thumbnail: noise2DPNG,
    tags: [TagNames.GPU, TagNames.Noise, TagNames.Education],
  }),

  noiseAscii: setupConfig({
    title: "Noise Ascii",
    route: "noise-ascii",
    load: () => import("@packages/creative/CPU/noise-ascii"),
    thumbnail: noiseAsciiPNG,
    tags: [TagNames.Noise, TagNames.ASCII],
  }),
} as const;

export const creatives: CreativeData[] = [
  configs.theSeer,
  configs.wealth,
  configs.connections,
  configs.pathfinder,
  configs.gameOfLife,
  configs.overgrowth,
  configs.firecrackers,
  configs.layers,
  configs.anger,
  configs.water,
  configs.systemShock,
  configs.randomWalkers,
  configs.stars,
  configs.tenThousand,
  configs.regeneration,
  configs.weave,
  configs.trigonometry,
  configs.quadtreeSimulation,
  configs.noiseLoop,
  configs.noiseAscii,
  configs.noise2D,
] as const;
