import { Creative } from "@packages/creative";
import { ArtTagNames } from "./art-tags";
import { Routes } from "../../routes";

import theSeerPNG from "./thumbnails/theSeer.png";
import layersPNG from "./thumbnails/layers.png";
import noise2DPNG from "./thumbnails/noise2D.png";
import randomWalkersPNG from "./thumbnails/randomWalkers.png";
import noiseLoopPNG from "./thumbnails/noiseLoop.png";
import noiseAsciiPNG from "./thumbnails/noiseAscii.png";
import tenThousandPNG from "./thumbnails/tenThousand.png";
import overgrowthPNG from "./thumbnails/overgrowth.png";
import firecrackersPNG from "./thumbnails/firecrackers.png";
import systemShockPNG from "./thumbnails/systemShock.png";
import regenerationPNG from "./thumbnails/regeneration.png";
import trigonometryPNG from "./thumbnails/trigonometry.png";
import angerPNG from "./thumbnails/anger.png";
import wealthPNG from "./thumbnails/wealth.png";
import starsPNG from "./thumbnails/stars.png";
import gameOfLifePNG from "./thumbnails/gameOfLife.png";
import weavePNG from "./thumbnails/weave.png";
import sandfallPNG from "./thumbnails/sandfall.png";
import connectionsPNG from "./thumbnails/connections.png";
import pathfinderPNG from "./thumbnails/pathfinder.png";
import waterPNG from "./thumbnails/water.png";
import quadtreeSimulationPNG from "./thumbnails/quadtree-simulation.png";

export interface ArtData<T> {
  title: string;
  route: string;

  thumbnail: string;
  tags: ArtTagNames[];

  artMain: (canvas: HTMLCanvasElement, settings?: Partial<T>) => void;
  artConfig?: Partial<T>;

  description?: string;
}

function defineArt<T>(art: ArtData<T>): ArtData<T> {
  return art;
}

const artConfigs = {
  theSeer: defineArt({
    title: "The Seer",
    route: Routes.arts.theSeer,
    thumbnail: theSeerPNG,
    tags: [
      ArtTagNames.Input,
      ArtTagNames.Particles,
      ArtTagNames.Image,
      ArtTagNames.Noise,
    ],
    artMain: Creative.CPU.TheSeer.main,
    description: "",
  }),

  wealth: defineArt({
    title: "Wealth",
    route: Routes.arts.wealth,
    thumbnail: wealthPNG,
    tags: [
      ArtTagNames.Input,
      ArtTagNames.GPU,
      ArtTagNames.Particles,
      ArtTagNames.Noise,
    ],
    artMain: Creative.GPU.Wealth.main,
    description: "",
  }),

  connections: defineArt({
    title: "Connections",
    route: Routes.arts.connections,
    thumbnail: connectionsPNG,
    tags: [ArtTagNames.Input, ArtTagNames.Collision, ArtTagNames.Physics],
    artMain: Creative.CPU.Connections.main,
    description: "",
  }),

  pathfinder: defineArt({
    title: "Pathfinder",
    route: Routes.arts.pathfinder,
    thumbnail: pathfinderPNG,
    tags: [ArtTagNames.Pathfinding, ArtTagNames.Noise],
    artMain: Creative.CPU.Pathfinder.main,
    description: "",
  }),

  systemShock: defineArt({
    title: "System Shock",
    route: Routes.arts.systemShock,
    thumbnail: systemShockPNG,
    tags: [
      ArtTagNames.ASCII,
      ArtTagNames.Image,
      ArtTagNames.Noise,
      ArtTagNames.Random,
    ],
    artMain: Creative.CPU.SystemShock.main,
    description: "",
  }),

  sandfall: defineArt({
    title: "Sandfall",
    route: Routes.arts.sandfall,
    thumbnail: sandfallPNG,
    tags: [
      ArtTagNames.Input,
      ArtTagNames.GPU,
      ArtTagNames.Automata,
      ArtTagNames.Physics,
    ],
    artMain: Creative.GPU.Sandfall.main,
    description: "",
  }),

  gameOfLife: defineArt({
    title: "Game of Life",
    route: Routes.arts.gameOfLife,
    thumbnail: gameOfLifePNG,
    tags: [ArtTagNames.Input, ArtTagNames.GPU, ArtTagNames.Automata],
    artMain: Creative.GPU.GameOfLife.main,
    description: "",
  }),

  layers: defineArt({
    title: "Layers",
    route: Routes.arts.layers,
    thumbnail: layersPNG,
    tags: [ArtTagNames.Input, ArtTagNames.GPU, ArtTagNames.Image],
    artMain: Creative.GPU.Layers.main,
    description: "",
  }),

  overgrowth: defineArt({
    title: "Overgrowth",
    route: Routes.arts.overgrowth,
    thumbnail: overgrowthPNG,
    tags: [ArtTagNames.Input, ArtTagNames.Particles, ArtTagNames.Noise],
    artMain: Creative.CPU.Overgrowth.main,
    description: "",
  }),

  firecrackers: defineArt({
    title: "Firecrackers",
    route: Routes.arts.firecrackers,
    thumbnail: firecrackersPNG,
    tags: [ArtTagNames.Input, ArtTagNames.Particles, ArtTagNames.Noise],
    artMain: Creative.CPU.Firecrackers.main,
    description: "",
  }),

  randomWalkers: defineArt({
    title: "Random Walkers",
    route: Routes.arts.randomWalkers,
    thumbnail: randomWalkersPNG,
    tags: [ArtTagNames.Random],
    artMain: Creative.CPU.RandomWalkers.main,
    description: "",
  }),

  weave: defineArt({
    title: "Weave",
    route: Routes.arts.weave,
    thumbnail: weavePNG,
    tags: [ArtTagNames.Bright, ArtTagNames.Image, ArtTagNames.Random],
    artMain: Creative.CPU.Weave.main,
    description: "",
  }),

  stars: defineArt({
    title: "Stars",
    route: Routes.arts.stars,
    thumbnail: starsPNG,
    tags: [ArtTagNames.GPU, ArtTagNames.Particles, ArtTagNames.Random],
    artMain: Creative.GPU.Stars.main,
    description: "",
  }),

  tenThousand: defineArt({
    title: "Ten Thousand",
    route: Routes.arts.tenThousand,
    thumbnail: tenThousandPNG,
    tags: [ArtTagNames.GPU, ArtTagNames.Particles, ArtTagNames.Image],
    artMain: Creative.GPU.TenThousand.main,
    description: "",
  }),

  anger: defineArt({
    title: "Anger",
    route: Routes.arts.anger,
    thumbnail: angerPNG,
    tags: [ArtTagNames.GPU, ArtTagNames.Noise],
    artMain: Creative.GPU.Anger.main,
    description: "",
  }),

  water: defineArt({
    title: "Water",
    route: Routes.arts.water,
    thumbnail: waterPNG,
    tags: [ArtTagNames.GPU, ArtTagNames.Noise],
    artMain: Creative.GPU.Water.main,
    description: "",
  }),

  regeneration: defineArt({
    title: "Regeneration",
    route: Routes.arts.regeneration,
    thumbnail: regenerationPNG,
    tags: [ArtTagNames.Input, ArtTagNames.GPU, ArtTagNames.Particles],
    artMain: Creative.GPU.Regeneration.main,
    description: "",
  }),

  trigonometry: defineArt({
    title: "Trigonometry",
    route: Routes.arts.trigonometry,
    thumbnail: trigonometryPNG,
    tags: [ArtTagNames.Education],
    artMain: Creative.CPU.Trigonometry.main,
    description: "",
  }),

  quadtreeSimulation: defineArt({
    title: "Quadtree Simulation",
    route: Routes.arts.quadtreeSimulation,
    thumbnail: quadtreeSimulationPNG,
    tags: [ArtTagNames.Education],
    artMain: Creative.CPU.QuadtreeSimulation.main,
    description: "",
  }),

  noiseLoop: defineArt({
    title: "Noise Loop",
    route: Routes.arts.noiseLoop,
    thumbnail: noiseLoopPNG,
    tags: [ArtTagNames.Noise],
    artMain: Creative.CPU.NoiseLoop.main,
    description: "",
  }),

  noise2D: defineArt({
    title: "Noise 2D",
    route: Routes.arts.noise2D,
    thumbnail: noise2DPNG,
    tags: [ArtTagNames.GPU, ArtTagNames.Noise],
    artMain: Creative.GPU.Noise2D.main,
    description: "",
  }),

  noiseAscii: defineArt({
    title: "Noise Ascii",
    route: Routes.arts.noiseAscii,
    thumbnail: noiseAsciiPNG,
    tags: [ArtTagNames.Noise, ArtTagNames.ASCII],
    artMain: Creative.CPU.NoiseAscii.main,
    description: "",
  }),
};

export const artData: ArtData<any>[] = [
  artConfigs.theSeer,
  artConfigs.wealth,
  artConfigs.connections,
  artConfigs.pathfinder,
  artConfigs.gameOfLife,
  artConfigs.overgrowth,
  artConfigs.firecrackers,
  artConfigs.layers,
  artConfigs.anger,
  artConfigs.water,
  artConfigs.sandfall,
  artConfigs.randomWalkers,
  artConfigs.stars,
  artConfigs.weave,
  artConfigs.tenThousand,
  artConfigs.regeneration,
  artConfigs.systemShock,
  artConfigs.trigonometry,
  artConfigs.quadtreeSimulation,
  artConfigs.noiseLoop,
  artConfigs.noiseAscii,
  artConfigs.noise2D,
] as const;
