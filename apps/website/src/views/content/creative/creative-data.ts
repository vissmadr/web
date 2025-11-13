import { Creative } from "@packages/creative";
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

export interface CreativeData<T> {
  title: string;
  route: string;
  main: (canvas: HTMLCanvasElement, settings?: Partial<T>) => void;
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
    main: Creative.CPU.TheSeer.main,
    thumbnail: theSeerPNG,
    tags: [TagNames.Input, TagNames.Particles, TagNames.Image, TagNames.Noise],
    description: "",
  }),

  wealth: setupConfig({
    title: "Wealth",
    route: "wealth",
    main: Creative.GPU.Wealth.main,
    thumbnail: wealthPNG,
    tags: [
      TagNames.Input,
      TagNames.GPU,
      TagNames.Particles,
      TagNames.Noise,
      TagNames.Physics,
    ],
    description: "",
  }),

  connections: setupConfig({
    title: "Connections",
    route: "connections",
    main: Creative.CPU.Connections.main,
    thumbnail: connectionsPNG,
    tags: [TagNames.Input, TagNames.Collision, TagNames.Physics],
    description: "",
  }),

  pathfinder: setupConfig({
    title: "Pathfinder",
    route: "pathfinder",
    main: Creative.CPU.Pathfinder.main,
    thumbnail: pathfinderPNG,
    tags: [TagNames.Pathfinding, TagNames.Noise, TagNames.Random],
    description: "",
  }),

  systemShock: setupConfig({
    title: "System Shock",
    route: "system-shock",
    main: Creative.CPU.SystemShock.main,
    thumbnail: systemShockPNG,
    tags: [TagNames.ASCII, TagNames.Image, TagNames.Noise, TagNames.Random],
    description: "",
  }),

  gameOfLife: setupConfig({
    title: "Game of Life",
    route: "game-of-life",
    main: Creative.GPU.GameOfLife.main,
    thumbnail: gameOfLifePNG,
    tags: [TagNames.Input, TagNames.GPU, TagNames.Automata],
    description: "",
  }),

  layers: setupConfig({
    title: "Layers",
    route: "layers",
    main: Creative.GPU.Layers.main,
    thumbnail: layersPNG,
    tags: [TagNames.Input, TagNames.GPU, TagNames.Image],
    description: "",
  }),

  overgrowth: setupConfig({
    title: "Overgrowth",
    route: "overgrowth",
    main: Creative.CPU.Overgrowth.main,
    thumbnail: overgrowthPNG,
    tags: [TagNames.Input, TagNames.Particles, TagNames.Noise],
    description: "",
  }),

  firecrackers: setupConfig({
    title: "Firecrackers",
    route: "firecrackers",
    main: Creative.CPU.Firecrackers.main,
    thumbnail: firecrackersPNG,
    tags: [TagNames.Input, TagNames.Particles, TagNames.Noise],
    description: "",
  }),

  randomWalkers: setupConfig({
    title: "Random Walkers",
    route: "random-walkers",
    main: Creative.CPU.RandomWalkers.main,
    thumbnail: randomWalkersPNG,
    tags: [TagNames.Random],
    description: "",
  }),

  weave: setupConfig({
    title: "Weave",
    route: "weave",
    main: Creative.CPU.Weave.main,
    thumbnail: weavePNG,
    tags: [TagNames.Bright, TagNames.Image, TagNames.Random],
    description: "",
  }),

  stars: setupConfig({
    title: "Stars",
    route: "stars",
    main: Creative.GPU.Stars.main,
    thumbnail: starsPNG,
    tags: [TagNames.GPU, TagNames.Particles, TagNames.Random],
    description: "",
  }),

  tenThousand: setupConfig({
    title: "Ten Thousand",
    route: "ten-thousand",
    main: Creative.GPU.TenThousand.main,
    thumbnail: tenThousandPNG,
    tags: [TagNames.GPU, TagNames.Particles, TagNames.Image],
    description: "",
  }),

  anger: setupConfig({
    title: "Anger",
    route: "anger",
    main: Creative.GPU.Anger.main,
    thumbnail: angerPNG,
    tags: [TagNames.GPU, TagNames.Noise],
    description: "",
  }),

  water: setupConfig({
    title: "Water",
    route: "water",
    main: Creative.GPU.Water.main,
    thumbnail: waterPNG,
    tags: [TagNames.GPU, TagNames.Noise],
    description: "",
  }),

  regeneration: setupConfig({
    title: "Regeneration",
    route: "regeneration",
    main: Creative.GPU.Regeneration.main,
    thumbnail: regenerationPNG,
    tags: [TagNames.Input, TagNames.GPU, TagNames.Particles, TagNames.Physics],
    description: "",
  }),

  trigonometry: setupConfig({
    title: "Trigonometry",
    route: "trigonometry",
    main: Creative.CPU.Trigonometry.main,
    thumbnail: trigonometryPNG,
    tags: [TagNames.Education],
    description: "",
  }),

  quadtreeSimulation: setupConfig({
    title: "Quadtree Simulation",
    route: "quadtree-simulation",
    main: Creative.CPU.QuadtreeSimulation.main,
    thumbnail: quadtreeSimulationPNG,
    tags: [TagNames.Education, TagNames.Particles],
    description: "",
  }),

  noiseLoop: setupConfig({
    title: "Noise Loop",
    route: "noise-loop",
    main: Creative.CPU.NoiseLoop.main,
    thumbnail: noiseLoopPNG,
    tags: [TagNames.Noise],
    description: "",
  }),

  noise2D: setupConfig({
    title: "Noise 2D",
    route: "noise-2d",
    main: Creative.GPU.Noise2D.main,
    thumbnail: noise2DPNG,
    tags: [TagNames.GPU, TagNames.Noise, TagNames.Education],
    description: "",
  }),

  noiseAscii: setupConfig({
    title: "Noise Ascii",
    route: "noise-ascii",
    main: Creative.CPU.NoiseAscii.main,
    thumbnail: noiseAsciiPNG,
    tags: [TagNames.Noise, TagNames.ASCII],
    description: "",
  }),
} as const;

export const creatives: CreativeData<any>[] = [
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
